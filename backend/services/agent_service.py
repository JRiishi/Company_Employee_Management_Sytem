import sys
import os
from typing import Dict, Any, List

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

try:
    from HR_DECISION.agent import hr_decision_agent
    from Payroll_Agent.agent import payroll_agent
    from Performance_agent.agent import performance_agent
    from task_manager.agent import task_manager_agent
except ImportError:
    # Need to keep the mock data functional if there are import issues when google.adk module missing
    pass

class AgentService:
    @staticmethod
    def get_employee_dashboard(emp_id: int) -> Dict[str, Any]:
        """Combine insights from multiple agents for the employee dashboard."""
        # This calls the actual agent logic in production. Passing through standard responses.
        # Example: perf_data = evaluate_performance(emp_id)
        
        # MOCK WRAPPER until real agent functions are bound:
        from routes.tasks import get_db_connection
        from datetime import datetime
        
        # Get tasks from database
        tasks = []
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor(dictionary=True)
                # Tasks
                cursor.execute("SELECT task_id, task_id as id, Title as title, CASE WHEN LOWER(status) = 'in_progress' THEN 'In Progress' WHEN LOWER(status) = 'completed' THEN 'Completed' ELSE 'Pending' END as status, DATE_FORMAT(due_date, '%Y-%m-%d') as deadline, DATE_FORMAT(created_at, '%Y-%m-%d') as created_at, DATE_FORMAT(completed_at, '%Y-%m-%d') as completed_at FROM task WHERE assign_to = %s LIMIT 5", (emp_id,))
                db_tasks = cursor.fetchall()
                if db_tasks:
                    tasks = db_tasks
                    for task in tasks:
                        if 'completed_at' not in task:
                            task['completed_at'] = None
                        if task['created_at'] is None:
                            task['created_at'] = "2026-04-18"

                # Performance
                perf_history = []
                current_score = 8.5
                cursor.execute("SELECT score, date FROM performance WHERE emp_id = %s ORDER BY date ASC", (emp_id,))
                perf_rows = cursor.fetchall()
                if perf_rows:
                    for row in perf_rows:
                        perf_history.append({"review_date": row['date'].strftime("%Y-%m"), "score": row['score']})
                    current_score = perf_history[-1]['score']
            except Exception as e:
                print("Error aggregating dashboard:", e)
            finally:
                conn.close()

        return {
            "performance": {"score": current_score, "trend": "+0.5", "history": perf_history},
            "salary": {"current": 85000, "next_review": "2026-06-01"},
            "tasks": {
                "completed": len([t for t in tasks if t.get('status') == 'completed']), 
                "pending": len([t for t in tasks if t.get('status') == 'pending']),
                "tasks": tasks
            },
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

    @staticmethod
    async def _run_agent(agent, message: str) -> str:
        """Helper to run an ADK agent synchronously-like but we use an event loop mechanism."""
        from google.adk.runners import InMemoryRunner
        from google.genai.types import Content, Part
        runner = InMemoryRunner(app_name=agent.name, agent=agent)
        try:
            session = await runner.session_service.create_session(user_id="user1", app_name=agent.name)
            content = Content(role="user", parts=[Part(text=message)])
            last_text = ""
            async for event in runner.run_async(user_id=session.user_id, session_id=session.id, new_message=content):
                if getattr(event, 'content', None) and event.content and getattr(event.content, 'parts', None):
                    for p in event.content.parts:
                        if getattr(p, 'text', None) and not getattr(p, 'thought', False):
                            last_text += p.text
            return last_text
        except Exception as e:
            import traceback
            traceback.print_exc()
            error_msg = str(e)
            if "503" in error_msg or "UNAVAILABLE" in error_msg:
                return "I'm currently experiencing high demand and having trouble connecting to my AI brain. Please try your request again in a few moments."
            return f"Error running agent: {error_msg}"
        finally:
            await runner.close()

    @staticmethod
    async def calculate_employee_salary_chat(emp_id: int, message: str, context: dict) -> dict:
        """Natural language interface to Payroll Agent"""
        try:
            from Payroll_Agent.agent import payroll_agent
            reply_text = await AgentService._run_agent(payroll_agent, f"Target employee ID is {emp_id}. Context: {context}. User message: {message}")
            return {
                "response": reply_text,
                "data": {},
                "suggestions": ["Calculate tax deductions", "Generate my payslip"]
            }
        except ImportError:
            return {
                "response": "I am the Payroll Agent. Your current base salary is $80,000 with a $5,000 bonus.",
                "data": {"base": 80000, "bonus": 5000},
                "suggestions": ["Calculate tax deductions", "Generate my payslip"]
            }

    @staticmethod
    async def get_performance_chat(emp_id: int, message: str, context: dict) -> dict:
        """Natural language interface to Performance Agent"""
        try:
            from Performance_agent.agent import performance_agent
            reply_text = await AgentService._run_agent(performance_agent, f"Target employee ID is {emp_id}. Context: {context}. User message: {message}")
            return {
                "response": reply_text,
                "data": {},
                "suggestions": ["Predict next quarter", "Show top performers"]
            }
        except ImportError:
            return {
                "response": "I am the Performance Agent. Your last review score was 8.5/10.",
                "data": {"score": 8.5, "trend": "+0.5"},
                "suggestions": ["Predict next quarter", "Show top performers"]
            }

    @staticmethod
    async def run_hr_decision_chat(emp_id: int, message: str, context: dict) -> dict:
        """Natural language interface to HR Decision Agent"""
        try:
            from HR_DECISION.agent import hr_decision_agent
            reply_text = await AgentService._run_agent(hr_decision_agent, f"Target employee ID is {emp_id}. Context: {context}. User message: {message}")
            return {
                "response": reply_text,
                "data": {},
                "suggestions": ["Show succession plan", "Any flight risks?"]
            }
        except ImportError:
            return {
                "response": "I am the HR Decision Agent. Employee is recommended for promotion.",
                "data": {"action": "promote"},
                "suggestions": ["Show succession plan", "Any flight risks?"]
            }

    @staticmethod
    async def recommend_task_chat(emp_id: int, message: str, context: dict) -> dict:
        """Natural language interface to Task Manager Agent"""
        try:
            from task_manager.agent import task_manager_agent
            reply_text = await AgentService._run_agent(task_manager_agent, f"Target employee ID is {emp_id}. Context: {context}. User message: {message}")
            return {
                "response": reply_text,
                "data": {},
                "suggestions": ["Estimate completion time", "Optimize my workload"]
            }
        except ImportError:
            return {
                "response": "I am the Task Manager. I recommend assigning you to the next backend integration task.",
                "data": {"recommended_task": "Backend Auth"},
                "suggestions": ["Estimate completion time", "Optimize my workload"]
            }
