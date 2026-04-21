# 🤖 AGENT CHAT — new file
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from security import require_role
from services.agent_service import AgentService

router = APIRouter(prefix="/api/agent", tags=["agent-chat"])

class ChatRequest(BaseModel):
    agent: str          # "payroll" | "performance" | "hr_decision" | "task_manager"
    message: str        # Natural language user message
    emp_id: Optional[int] = None  # Target employee (defaults to current user)
    context: Optional[dict] = None  # Optional extra context

class ChatResponse(BaseModel):
    success: bool
    agent: str
    response: str
    data: Optional[dict] = None  # Structured data if agent returns it
    suggestions: Optional[list] = None  # Follow-up question suggestions

@router.post("/chat", response_model=ChatResponse)
async def agent_chat(
    request: ChatRequest,
    current_user=Depends(require_role(["employee", "manager", "admin", "hr"]))
):
    """
    Unified chat endpoint. Routes to correct agent based on request.agent field.
    Enforces role-based access on HR Decision Agent.
    """
    user_role = current_user.get("role")
    user_emp_id = current_user.get("user_id")
    
    # Default emp_id to current user if not provided
    target_emp_id = request.emp_id or user_emp_id

    # Role gate for HR Decision Agent
    if request.agent == "hr_decision" and user_role not in ["manager", "admin", "hr"]:
        raise HTTPException(
            status_code=403,
            detail="HR Decision Agent is only available to managers, admins, and HR personnel."
        )

    try:
        if request.agent == "payroll":
            result = await AgentService.calculate_employee_salary_chat(
                emp_id=target_emp_id,
                message=request.message,
                context=request.context or {}
            )
        elif request.agent == "performance":
            result = await AgentService.get_performance_chat(
                emp_id=target_emp_id,
                message=request.message,
                context=request.context or {}
            )
        elif request.agent == "hr_decision":
            result = await AgentService.run_hr_decision_chat(
                emp_id=target_emp_id,
                message=request.message,
                context=request.context or {}
            )
        elif request.agent == "task_manager":
            result = await AgentService.recommend_task_chat(
                emp_id=target_emp_id,
                message=request.message,
                context=request.context or {}
            )
        else:
            raise HTTPException(status_code=400, detail=f"Unknown agent: {request.agent}")

        return ChatResponse(
            success=True,
            agent=request.agent,
            response=result.get("response", "Agent completed the request."),
            data=result.get("data"),
            suggestions=result.get("suggestions", [])
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")