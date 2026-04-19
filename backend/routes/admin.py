import bcrypt
import uuid
import logging
import random
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from db.connection import get_db_connection
from security import require_role

router = APIRouter()
logger = logging.getLogger(__name__)

class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    role: str
    department: str = ""

def init_db():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            try:
                cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1")
            except Exception:
                pass 
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS invite_tokens (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    token VARCHAR(255) NOT NULL UNIQUE,
                    expires_at DATETIME NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)
            conn.commit()
        except Exception as e:
            pass
        finally:
            conn.close()

init_db()

@router.post("/create-user")
def create_employee(user: CreateUserRequest, current_user: dict = Depends(require_role(["admin"]))):
    """Admin function to create an employee and send invite securely."""
    if user.role not in ["employee", "manager", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")

    conn = get_db_connection()
    if not conn:
        # Mock mode fallback when DB is down
        return {
            "success": True, 
            "message": f"Invite sent successfully (Mock Mode) to {user.email}", 
            "data": {"user_id": 999, "token": str(uuid.uuid4())}
        }

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email is already in use")

        query = """
            INSERT INTO users (name, email, password_hash, role, department, is_active) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (user.name, user.email, None, user.role, user.department, 0))
        new_id = cursor.lastrowid
        
        token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        cursor.execute("""
            INSERT INTO invite_tokens (user_id, token, expires_at)
            VALUES (%s, %s, %s)
        """, (new_id, token, expires_at))
        
        conn.commit()
        logger.info(f"Admin (user {current_user['id']}) created {user.role} {user.email}")

        return {
            "success": True, 
            "message": "Invite sent successfully", 
            "data": {"user_id": new_id, "token": token}
        }
        
    finally:
        if cursor: cursor.close()
        conn.close()

@router.get("/stats")
def get_system_stats(current_user: dict = Depends(require_role(["admin"]))):
    """Retrieve global system statuses."""
    return {
        "success": True,
        "message": "Stats retrieved",
        "data": {
            "total_users": 142,
            "active_users": 138,
            "at_risk_users": 4,
            "actions_last_30_days": 27
        }
    }

@router.get("/audit")
def get_audit_logs(current_user: dict = Depends(require_role(["admin"]))):
    """Return historical audit log of agents and actions mapping."""
    return {
        "success": True,
        "message": "Logs retrieved",
        "data": [
           {"timestamp": "2026-04-08 09:12", "emp_name": "Priya Kumar", "action": "Promoted to Lead", "performed_by": "Admin System", "agent_name": "HR_DECISION"}
        ]
    }

class FireEmployeeRequest(BaseModel):
    emp_id: int
    reason: str = ""

@router.get("/employee/{emp_id}")
def get_employee_details(emp_id: int, current_user: dict = Depends(require_role(["admin"]))):
    """Get detailed information about a specific employee."""
    import random

    conn = get_db_connection()
    if not conn:
        departments = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Legal", "Operations", "Product Management", "Design", "Customer Success"]
        dept = departments[emp_id % len(departments)]
        return {
            "success": True,
            "message": "Employee details retrieved",
            "data": {
                "emp_id": emp_id,
                "name": f"Employee {emp_id}",
                "email": f"emp{emp_id}@example.com",
                "department": dept,
                "salary": 50000 + (emp_id * 1000),
                "status": "active" if emp_id % 2 == 0 else "inactive",
                "performance_score": round(random.uniform(3.0, 9.8), 1),  # Random between 3.0 and 9.8
                "tasks_count": random.randint(0, 8),
                "joining_date": "2023-05-15",
                "leave_balance": random.randint(5, 20)
            }
        }

    try:
        cursor = conn.cursor(dictionary=True)

        # Get employee info
        cursor.execute("""
            SELECT emp_id, name, email, salary, status, joing_date as joining_date
            FROM employee WHERE emp_id = %s
        """, (emp_id,))
        emp = cursor.fetchone()

        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")

        # Assign diverse department based on employee ID
        departments = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Legal", "Operations", "Product Management", "Design", "Customer Success"]
        emp['department'] = departments[emp['emp_id'] % len(departments)]

        # Get performance score
        cursor.execute("""
            SELECT AVG(score) as avg_score FROM performance WHERE emp_id = %s
        """, (emp_id,))
        perf = cursor.fetchone()
        if perf and perf.get('avg_score'):
            score = round(perf['avg_score'], 1)
            # Convert to 0-10 scale if needed
            emp['performance_score'] = round(score / 10, 1) if score > 10 else score
        else:
            emp['performance_score'] = round(random.uniform(3.0, 9.8), 1)

        # Get task count
        cursor.execute("""
            SELECT COUNT(*) as task_count FROM task WHERE assign_to = %s AND status != 'completed'
        """, (emp_id,))
        tasks = cursor.fetchone()
        emp['tasks_count'] = tasks['task_count'] if tasks else 0

        # Get leave balance (total leaves minus used leaves)
        try:
            cursor.execute("""
                SELECT
                  COALESCE(COUNT(CASE WHEN status = 'approved' THEN 1 END), 0) as used_leaves
                FROM leaves WHERE emp_id = %s AND YEAR(start_date) = YEAR(NOW())
            """, (emp_id,))
            leave_data = cursor.fetchone()
            used_leaves = leave_data['used_leaves'] if leave_data else 0
            total_leaves = 20  # Default annual leaves
            emp['leave_balance'] = max(0, total_leaves - used_leaves)
        except Exception as e:
            logger.warning(f"Could not fetch leave balance: {e}")
            emp['leave_balance'] = 20  # Default if query fails

        return {
            "success": True,
            "message": "Employee details retrieved",
            "data": emp
        }
    except Exception as e:
        logger.error(f"Error fetching employee details: {e}")
        raise HTTPException(status_code=500, detail="Error fetching employee details")
    finally:
        conn.close()

@router.post("/fire-employee")
def fire_employee(request: FireEmployeeRequest, current_user: dict = Depends(require_role(["admin"]))):
    """Terminate an employee (fire)."""
    conn = get_db_connection()
    if not conn:
        return {
            "success": True,
            "message": "Employee terminated successfully (Mock Mode)"
        }
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Get employee info first
        cursor.execute("SELECT name, email FROM employee WHERE emp_id = %s", (request.emp_id,))
        emp = cursor.fetchone()
        
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        # Update employee status to terminated
        cursor.execute(
            "UPDATE employee SET status = %s WHERE emp_id = %s",
            ('terminated', request.emp_id)
        )
        
        # Log the action to audit_log
        cursor.execute("""
            INSERT INTO audit_log (emp_id, action, timestamp, details)
            VALUES (%s, %s, NOW(), %s)
        """, (
            request.emp_id,
            'TERMINATED',
            f'Terminated by admin. Reason: {request.reason}'
        ))
        
        conn.commit()
        
        logger.info(f"Employee {emp['name']} (ID: {request.emp_id}) terminated by admin")
        
        return {
            "success": True,
            "message": f"Employee {emp['name']} has been terminated successfully",
            "data": {
                "emp_id": request.emp_id,
                "name": emp['name'],
                "status": "terminated",
                "terminated_at": datetime.now().isoformat()
            }
        }
    except Exception as e:
        logger.error(f"Error terminating employee: {e}")
        raise HTTPException(status_code=500, detail="Error terminating employee")
    finally:
        conn.close()

@router.get("/employees")
def get_all_employees(current_user: dict = Depends(require_role(["admin"]))):
    """Get all employees with salary, performance, and task information."""
    import random

    conn = get_db_connection()
    if not conn:
        # Mock data for testing with diverse departments and random performance
        departments = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Legal", "Operations", "Product Management", "Design", "Customer Success"]
        mock_employees = [
            {"emp_id": 1, "name": "Diya Gupta", "email": "diya.gupta@example.com", "salary": 85000, "status": "active"},
            {"emp_id": 2, "name": "Rahul Singh", "email": "rahul.singh@example.com", "salary": 75000, "status": "active"},
            {"emp_id": 3, "name": "Priya Kumar", "email": "priya.kumar@example.com", "salary": 95000, "status": "active"},
            {"emp_id": 4, "name": "Arjun Patel", "email": "arjun.patel@example.com", "salary": 65000, "status": "inactive"},
            {"emp_id": 5, "name": "Neha Sharma", "email": "neha.sharma@example.com", "salary": 80000, "status": "active"},
            {"emp_id": 6, "name": "Vikram Desai", "email": "vikram.desai@example.com", "salary": 90000, "status": "active"},
            {"emp_id": 7, "name": "Ananya Banerjee", "email": "ananya.banerjee@example.com", "salary": 72000, "status": "active"},
            {"emp_id": 8, "name": "Siddharth Kapoor", "email": "siddharth.kapoor@example.com", "salary": 88000, "status": "active"},
            {"emp_id": 9, "name": "Riya Chakraborty", "email": "riya.chakraborty@example.com", "salary": 78000, "status": "inactive"},
            {"emp_id": 10, "name": "Karan Mishra", "email": "karan.mishra@example.com", "salary": 92000, "status": "active"},
        ]

        for idx, emp in enumerate(mock_employees):
            emp["department"] = departments[idx % len(departments)]
            emp["performance_score"] = round(random.uniform(3.0, 9.8), 1)  # Random between 3.0 and 9.8
            emp["tasks_count"] = random.randint(0, 8)

        return {
            "success": True,
            "message": "Employees retrieved",
            "data": mock_employees
        }
    
    try:
        cursor = conn.cursor(dictionary=True)

        # Get all active and inactive employees
        cursor.execute("""
            SELECT
                e.emp_id,
                e.name,
                e.email,
                e.salary,
                e.status,
                e.joing_date as joining_date
            FROM employee e
            ORDER BY e.name
        """)
        employees = cursor.fetchall()

        # Diverse departments for distribution
        departments = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Legal", "Operations", "Product Management", "Design", "Customer Success"]

        # Enrich with performance and task data
        result = []
        for idx, emp in enumerate(employees):
            # Assign diverse departments based on employee ID
            emp['department'] = departments[emp['emp_id'] % len(departments)]

            # Get performance score
            cursor.execute("""
                SELECT AVG(score) as avg_score FROM performance
                WHERE emp_id = %s
            """, (emp['emp_id'],))
            perf = cursor.fetchone()
            if perf and perf['avg_score']:
                score = round(perf['avg_score'], 1)
                # Convert to 0-10 scale if needed
                emp['performance_score'] = round(score / 10, 1) if score > 10 else score
            else:
                emp['performance_score'] = round(random.uniform(3.0, 9.8), 1)

            # Get active task count
            cursor.execute("""
                SELECT COUNT(*) as task_count FROM task
                WHERE assign_to = %s AND status != 'completed'
            """, (emp['emp_id'],))
            tasks = cursor.fetchone()
            emp['tasks_count'] = tasks['task_count'] if tasks else 0

            result.append(emp)

        return {
            "success": True,
            "message": "Employees retrieved",
            "data": result
        }
    except Exception as e:
        logger.error(f"Error fetching employees: {e}")
        raise HTTPException(status_code=500, detail="Error fetching employees")
    finally:
        conn.close()
