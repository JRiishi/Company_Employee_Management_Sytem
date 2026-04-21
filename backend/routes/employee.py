from fastapi import APIRouter, HTTPException, Depends
from services.agent_service import AgentService
from security import require_role

router = APIRouter()

@router.get("/{emp_id}/dashboard")
def get_dashboard(emp_id: int, current_user: dict = Depends(require_role(["employee", "manager", "admin"]))):
    """
    Combines outputs from Performance, Payroll, and Task agents 
    to populate the employee's global dashboard view.
    """
    # Enforce access - an employee can only view their own dashboard
    if current_user["role"] == "employee" and current_user["id"] != emp_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this dashboard")

    try:
        data = AgentService.get_employee_dashboard(emp_id)
        return {"success": True, "message": "Dashboard loaded", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to load dashboard")

@router.get("/{emp_id}/tasks")
def get_tasks(emp_id: int, current_user: dict = Depends(require_role(["employee", "manager", "admin"]))):
    if current_user["role"] == "employee" and current_user["id"] != emp_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        data = [{"id": 1, "title": "Update DB Schema", "status": "In Progress"}]
        return {"success": True, "message": "Tasks loaded", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to load tasks")

@router.get("/{emp_id}/performance")
def get_performance(emp_id: int, current_user: dict = Depends(require_role(["employee", "manager", "admin"]))):
    if current_user["role"] == "employee" and current_user["id"] != emp_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        from routes.tasks import get_db_connection
        data = {"current_score": 0, "history": []}
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT score, date FROM performance WHERE emp_id = %s ORDER BY date ASC", (emp_id,))
                perf_rows = cursor.fetchall()
                if perf_rows:
                    data['history'] = [{"review_date": row['date'].strftime("%Y-%m"), "score": row['score']} for row in perf_rows]
                    data['current_score'] = data['history'][-1]['score']
            finally:
                conn.close()
        return {"success": True, "message": "Performance loaded", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to load performance")

@router.get("/{emp_id}/salary")
def get_salary(emp_id: int, current_user: dict = Depends(require_role(["employee", "manager", "admin"]))):
    if current_user["role"] == "employee" and current_user["id"] != emp_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        data = AgentService.calculate_salary(emp_id)
        return {"success": True, "message": "Salary loaded", "data": data}
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to load salary")
