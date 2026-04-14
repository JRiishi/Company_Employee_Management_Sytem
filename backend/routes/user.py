from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from db.connection import get_db_connection
from security import require_role
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class UpdateProfileRequest(BaseModel):
    name: str = None
    department: str = None

@router.get("/me")
def get_me(current_user: dict = Depends(require_role(["employee", "manager", "admin"]))):
    """Retrieve current user data."""
    # Check if mock user
    if current_user["id"] in [101, 102, 103]:
        return {
            "success": True,
            "message": "User data retrieved",
            "data": {
                "id": current_user["id"],
                "name": current_user.get("name", "Demo User"),
                "email": current_user["email"],
                "role": current_user["role"],
                "department": "Engineering"
            }
        }

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, role, department FROM users WHERE id = %s", (current_user["id"],))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {
            "success": True,
            "message": "User data retrieved",
            "data": user
        }
    finally:
        conn.close()

@router.put("/update-profile")
def update_profile(body: UpdateProfileRequest, current_user: dict = Depends(require_role(["employee", "manager", "admin"]))):
    """Update profile logic."""
    if current_user["id"] in [101, 102, 103]:
        # Return success for mock user
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": {
                "id": current_user["id"],
                "name": body.name,
                "email": current_user["email"],
                "role": current_user["role"],
                "department": body.department
            }
        }

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        cursor = conn.cursor()
        
        updates = []
        params = []
        if body.name is not None:
            updates.append("name = %s")
            params.append(body.name)
        if body.department is not None:
            updates.append("department = %s")
            params.append(body.department)
            
        if not updates:
            raise HTTPException(status_code=400, detail="No valid fields to update")
            
        params.append(current_user["id"])
        
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
        cursor.execute(query, params)
        conn.commit()
        
        # return updated user
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, role, department FROM users WHERE id = %s", (current_user["id"],))
        updated_user = cursor.fetchone()

        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": updated_user
        }
    except Exception as e:
        logger.error(f"Error updating profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile")
    finally:
        conn.close()
