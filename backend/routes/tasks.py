from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from backend.services.agent_service import AgentService
from backend.security import require_role

router = APIRouter()

class TaskAssignment(BaseModel):
    assigned_to: int
    title: str
    description: str
    deadline: str

@router.post("/assign")
def assign_team_task(task: TaskAssignment, current_user: dict = Depends(require_role(["manager", "admin"]))):
    """Invoke the Task Manager Agent to push a new task to an employee."""
    try:
        response = AgentService.assign_task(
            task.assigned_to, task.title, task.description, task.deadline
        )
        return {"success": True, "message": "Task assigned successfully", "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to assign task")
