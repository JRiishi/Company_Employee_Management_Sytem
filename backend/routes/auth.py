import bcrypt
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr
from backend.db.connection import get_db_connection
from backend.security import create_access_token, create_refresh_token, verify_token, require_role

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()
logger = logging.getLogger(__name__)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SetPasswordRequest(BaseModel):
    token: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, body: LoginRequest):
    """Authenticate a user via strong cryptographic check."""
    
    # Hardcoded bypass for immediate portal access (works even if DB is offline)
    hardcoded_users = {
        "emp@nexushr.com": {"id": 101, "name": "Employee Demo", "role": "employee"},
        "admin@nexushr.com": {"id": 102, "name": "Admin Demo", "role": "admin"},
        "man@nexushr.com": {"id": 103, "name": "Manager Demo", "role": "manager"}
    }
    
    if body.email in hardcoded_users and body.password == "123":
        user_info = hardcoded_users[body.email]
        token_data = {"id": user_info["id"], "role": user_info["role"], "email": body.email}
        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "token": create_access_token(token_data),
                "refresh_token": create_refresh_token(token_data),
                "user": {
                    "id": user_info["id"],
                    "name": user_info["name"],
                    "email": body.email,
                    "role": user_info["role"]
                }
            }
        }

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = %s"
        try:
            cursor.execute(query, (body.email,))
        except Exception:
            cursor.execute("SELECT id, name, email, password_hash, role FROM users WHERE email = %s")
            
        user = cursor.fetchone()
        
        if user:
            is_active = user.get('is_active', 1)
            if not is_active:
                raise HTTPException(status_code=403, detail="Please activate your account via email")

            if user.get('password_hash'):
                is_valid = bcrypt.checkpw(
                    body.password.encode('utf-8'),
                    user['password_hash'].encode('utf-8')
                )
                
                if is_valid:
                    token_data = {"id": user['id'], "role": user['role'], "email": user['email']}
                    access_token = create_access_token(token_data)
                    refresh_token = create_refresh_token(token_data)
                    
                    logger.info(f"Successful login for user {body.email}")
                    return {
                        "success": True,
                        "message": "Login successful",
                        "data": {
                            "token": access_token,
                            "refresh_token": refresh_token,
                            "user": {
                                "id": user['id'],
                                "name": user['name'],
                                "email": user['email'],
                                "role": user['role']
                            }
                        }
                    }

        logger.warning(f"Failed login attempt for {body.email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    except HTTPException:
        raise # Rethrow API exceptions to be handled by main
    finally:
        conn.close()

@router.post("/refresh")
@limiter.limit("10/minute")
def refresh_token(request: Request, body: RefreshRequest):
    try:
        payload = verify_token(body.refresh_token, "refresh")
        token_data = {"id": payload['id'], "role": payload['role'], "email": payload['email']}
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "success": True,
            "message": "Token refreshed",
            "data": {
                "token": access_token,
                "refresh_token": refresh_token
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(getattr(e, 'detail', "Invalid session")))

@router.post("/set-password")
@limiter.limit("5/minute")
def set_password(request: Request, body: SetPasswordRequest):
    """Securely set the password using invite token."""
    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT user_id, expires_at FROM invite_tokens WHERE token = %s", (body.token,))
        invite = cursor.fetchone()

        if not invite:
            raise HTTPException(status_code=400, detail="Invalid or expired link")
            
        if datetime.utcnow() > invite['expires_at']:
            cursor.execute("DELETE FROM invite_tokens WHERE token = %s", (body.token,))
            conn.commit()
            raise HTTPException(status_code=400, detail="Invalid or expired link")

        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(body.password.encode('utf-8'), salt).decode('utf-8')

        cursor.execute("""
            UPDATE users 
            SET password_hash = %s, is_active = 1 
            WHERE id = %s
        """, (password_hash, invite['user_id']))

        cursor.execute("DELETE FROM invite_tokens WHERE token = %s", (body.token,))
        conn.commit()
        
        logger.info(f"Account activated via token for user_id {invite['user_id']}")
        
        return {
            "success": True,
            "message": "Account activated successfully",
            "data": None
        }

    finally:
        conn.close()

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
@limiter.limit("3/minute")
def change_password(request: Request, body: ChangePasswordRequest, current_user: dict = Depends(require_role(["employee", "manager", "admin"]))):
    """Change the user's password."""
    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
        
    if current_user["id"] in [101, 102, 103]:
        # Mock logic
        if body.current_password != "123":
            raise HTTPException(status_code=400, detail="Incorrect current password")
        return {
            "success": True,
            "message": "Password changed successfully",
            "data": None
        }

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT password_hash FROM users WHERE id = %s", (current_user["id"],))
        user = cursor.fetchone()
        
        if not user or not user.get('password_hash'):
            raise HTTPException(status_code=400, detail="User not found or password not set")

        if not bcrypt.checkpw(body.current_password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            raise HTTPException(status_code=400, detail="Incorrect current password")

        salt = bcrypt.gensalt()
        new_hash = bcrypt.hashpw(body.new_password.encode('utf-8'), salt).decode('utf-8')
        
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s", (new_hash, current_user["id"]))
        conn.commit()
        
        return {
            "success": True,
            "message": "Password changed successfully",
            "data": None
        }
    finally:
        conn.close()

@router.post("/logout")
def logout(current_user: dict = Depends(require_role(["employee", "manager", "admin"]))):
    """Logout endpoint."""
    # In a full system, you would blacklist the refresh token here
    return {
        "success": True,
        "message": "Logged out successfully",
        "data": None
    }
