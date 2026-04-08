from fastapi import APIRouter, HTTPException, Depends
from backend.services.agent_service import AgentService
from backend.security import require_role

router = APIRouter()

@router.get("/team")
def get_team_stats(current_user: dict = Depends(require_role(["manager", "admin"]))):
    """Aggregate statistics for the manager's team summary."""
    try:
        data = AgentService.get_team_data(manager_id=current_user["id"])
        return {"success": True, "message": "Team stats loaded", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to load team data")

@router.get("/employees")
def get_employees(current_user: dict = Depends(require_role(["manager", "admin"]))):
    """Retrieve detailed members of the manager's team."""
    try:
        data = [
            {"id": 1, "name": "Alice Chen", "role": "Frontend Engineer", "performance_score": 9.2, "active_tasks": 4, "status": "On Track"},
            {"id": 2, "name": "Marcus Johnson", "role": "Backend Engineer", "performance_score": 8.5, "active_tasks": 6, "status": "At Risk"},
        ]
        return {"success": True, "message": "Employees loaded", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to load employees")

@router.get("/performance")
def get_performance_trend(current_user: dict = Depends(require_role(["manager", "admin"]))):
    """Team-wide performance trend."""
    try:
        data = [
            {"review_date": "Jan", "score": 8.2},
            {"review_date": "Feb", "score": 8.4},
            {"review_date": "Mar", "score": 8.6}
        ]
        return {"success": True, "message": "Performance trend loaded", "data": data}
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to load performance trend")
