import sys
import os
from typing import Dict, Any, List

# Ensure root directory agents are importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# In a full system, you would import the specific agent execution functions like:
# from HR_DECISION.agent import process_hr_decision
# from Payroll_Agent.agent import calculate_salary
# from Performance_agent.agent import evaluate_performance
# from task_manager.agent import manage_tasks

class AgentService:
    @staticmethod
    def get_employee_dashboard(emp_id: int) -> Dict[str, Any]:
        """Combine insights from multiple agents for the employee dashboard."""
        # This calls the actual agent logic in production. Passing through standard responses.
        # Example: perf_data = evaluate_performance(emp_id)
        
        # MOCK WRAPPER until real agent functions are bound:
        return {
            "performance": {"score": 8.5, "trend": "+0.5"},
            "salary": {"current": 85000, "next_review": "2026-06-01"},
            "tasks": {"completed": 12, "pending": 3},
            "insights": "Performance is tracking above average. Keep up the momentum."
        }

    @staticmethod
    def get_team_data(manager_id: int) -> Dict[str, Any]:
        """Aggregate data for a manager's team view via agents."""
        return {
            "total_employees": 12,
            "active_tasks": 34,
            "avg_performance": 8.7,
            "pending_reviews": 5
        }

    @staticmethod
    def run_hr_decision(emp_id: int) -> Dict[str, Any]:
        """Invoke the HR agent to make a review decision on an employee."""
        # result = process_hr_decision(emp_id)
        return {
            "emp_id": emp_id,
            "name": "Target Employee",
            "action": "promote",
            "reason": "Consistent 9+ scores over last 3 cycles.",
            "confidence": 0.95
        }

    @staticmethod
    def assign_task(assigned_to: int, title: str, description: str, deadline: str) -> Dict[str, Any]:
        """Invoke the task manager agent to assign and calibrate new tasks."""
        # result = manage_tasks("assign", assigned_to, title, description, deadline)
        return {
            "success": True,
            "task_id": 999,
            "assigned_to": assigned_to,
            "status": "Assigned"
        }

    @staticmethod
    def calculate_salary(emp_id: int) -> Dict[str, Any]:
        """Invoke payroll agent to calculate compensation algorithms."""
        # result = calculate_salary(emp_id)
        return {
            "base": 80000,
            "bonus": 5000,
            "total": 85000
        }
