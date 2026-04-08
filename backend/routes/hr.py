from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from backend.services.agent_service import AgentService
from backend.security import require_role

router = APIRouter()

class HrAction(BaseModel):
    emp_id: int
    action: str

@router.get("/recommendations")
def get_hr_recommendations(current_user: dict = Depends(require_role(["admin"]))):
    """Ask the HR Decision agent for proactive workload and performance decisions."""
    try:
        decision = AgentService.run_hr_decision(emp_id=1)
        return {"success": True, "message": "Recommendations loaded", "data": [decision]}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to load recommendations")

@router.post("/action")
def execute_hr_action(action_data: HrAction, current_user: dict = Depends(require_role(["admin"]))):
    """Admin triggering an agent-approved or manual HR execution."""
    try:
         return {"success": True, "message": "Action executed successfully", "data": {"action": action_data.action, "emp_id": action_data.emp_id}}
    except Exception as e:
         raise HTTPException(status_code=500, detail="Failed to execute action")
