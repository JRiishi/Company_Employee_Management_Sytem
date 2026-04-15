from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from services.agent_service import AgentService
from security import require_role
from db.connection import get_db_connection
import logging
from datetime import datetime, timedelta
import random

logger = logging.getLogger(__name__)

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

@router.get("/employee/{emp_id}")
def get_employee_tasks(emp_id: int, filter: str = Query("month", regex="^(week|month|year)$")):
    """
    Get all tasks assigned to a specific employee with time-based filtering and stats.

    Query params:
    - filter: week, month, or year (default: month)
    """
    conn = get_db_connection()

    # Calculate date range based on filter
    now = datetime.now()
    if filter == "week":
        start_date = now - timedelta(days=7)
    elif filter == "month":
        start_date = now - timedelta(days=30)
    elif filter == "year":
        start_date = now - timedelta(days=365)
    else:
        start_date = now - timedelta(days=30)

    # Mock data with diverse statuses and dates - employee-specific
    def get_mock_tasks():
        # Use emp_id as seed for deterministic randomness
        random.seed(emp_id * 12345)  # Multiply by larger number for more variance

        # Task templates for different employee types
        task_templates = {
            "engineering": [
                "Code Review - Authentication Module",
                "API Integration with Payment Gateway",
                "Database Optimization",
                "Frontend Performance Testing",
                "Bug Fix - Login Page UI",
                "Unit Test Coverage Improvement",
                "Backend API Documentation",
                "System Architecture Design",
                "Security Audit and Patch",
                "Deployment Pipeline Setup",
            ],
            "sales": [
                "Client Follow-up Call",
                "Sales Proposal Preparation",
                "CRM Data Update",
                "Pipeline Review Meeting",
                "Demo Preparation",
                "Contract Negotiation",
                "Quarterly Business Review",
                "Lead Generation Campaign",
                "Sales Forecast Analysis",
                "Customer Retention Plan",
            ],
            "marketing": [
                "Campaign Analysis Report",
                "Social Media Content Creation",
                "Email Newsletter Design",
                "Market Research",
                "Brand Audit",
                "Conference Presentation",
                "Content Strategy Development",
                "Industry Trend Analysis",
                "Marketing ROI Report",
                "Customer Testimonial Collection",
            ],
            "hr": [
                "Employee Onboarding",
                "Performance Review Preparation",
                "Policy Update Documentation",
                "Training Session Planning",
                "Recruitment Screening",
                "Team Building Event Planning",
                "Exit Interview Follow-up",
                "Compensation Review Meeting",
                "Employee Wellness Program",
                "Diversity Initiative Planning",
            ],
        }

        # Select task templates based on emp_id
        template_type = list(task_templates.keys())[(emp_id - 1) % len(task_templates)]
        templates = task_templates[template_type]

        # Generate 12 employee-specific tasks
        all_tasks = []
        statuses = ["completed", "in_progress", "pending"]

        for i in range(12):
            task_title = templates[i % len(templates)]
            # More varied status distribution
            status_index = (emp_id + i * 7) % len(statuses)
            status = statuses[status_index]

            if i < 3:  # Week tasks
                days_ago = random.randint(1, 7)
            elif i < 8:  # Month tasks
                days_ago = random.randint(8, 30)
            else:  # Year tasks
                days_ago = random.randint(31, 250)

            created = now - timedelta(days=days_ago)
            due = created + timedelta(days=random.randint(5, 25))

            task = {
                "task_id": emp_id * 1000 + i + 1,
                "title": task_title,
                "status": status,
                "created_at": created.strftime("%Y-%m-%d"),
                "due_date": due.strftime("%Y-%m-%d"),
                "completed_at": (due - timedelta(days=random.randint(0, 3))).strftime("%Y-%m-%d") if status == "completed" else None,
            }
            all_tasks.append(task)

        # Filter tasks based on the time filter
        filtered_tasks = []
        for task in all_tasks:
            task_created = datetime.strptime(task["created_at"], "%Y-%m-%d")
            if task_created >= start_date:
                filtered_tasks.append(task)

        return filtered_tasks if filtered_tasks else all_tasks[:3]  # Return at least 3 tasks

    def calculate_stats(tasks):
        total = len(tasks)
        completed = len([t for t in tasks if t["status"] == "completed"])
        pending = len([t for t in tasks if t["status"] == "pending"])
        ongoing = len([t for t in tasks if t["status"] == "in_progress"])
        completion_rate = round((completed / total * 100), 1) if total > 0 else 0

        return {
            "total": total,
            "completed": completed,
            "pending": pending,
            "ongoing": ongoing,
            "completionRate": completion_rate,
        }

    if not conn:
        # Return mock data when DB is down
        mock_tasks = get_mock_tasks()
        stats = calculate_stats(mock_tasks)
        return {
            "success": True,
            "message": "Tasks retrieved (mock data)",
            "data": {
                **stats,
                "tasks": mock_tasks,
            }
        }

    try:
        cursor = conn.cursor(dictionary=True)

        # Query with date filtering
        query = """
            SELECT
                task_id,
                Title,
                status,
                due_date,
                created_at,
                completed_at
            FROM task
            WHERE assign_to = %s
            AND created_at >= %s
            ORDER BY created_at DESC
        """

        cursor.execute(query, (emp_id, start_date.strftime("%Y-%m-%d")))
        tasks = cursor.fetchall()

        # If no tasks found, return mock data
        if not tasks or len(tasks) == 0:
            mock_tasks = get_mock_tasks()
            stats = calculate_stats(mock_tasks)
            return {
                "success": True,
                "message": "Tasks retrieved (mock data - no real tasks found)",
                "data": {
                    **stats,
                    "tasks": mock_tasks,
                }
            }

        # Process tasks to ensure all fields exist
        for task in tasks:
            if 'created_at' not in task or task['created_at'] is None:
                task['created_at'] = datetime.now().strftime("%Y-%m-%d")
            if 'completed_at' not in task:
                task['completed_at'] = None
            # Normalize case
            if 'Title' not in task and 'title' in task:
                task['Title'] = task['title']

        # Calculate stats
        stats = calculate_stats(tasks)

        return {
            "success": True,
            "message": "Tasks retrieved",
            "data": {
                **stats,
                "tasks": tasks,
            }
        }
    except Exception as e:
        logger.error(f"Error fetching tasks: {e}")
        # Return mock data on error
        mock_tasks = get_mock_tasks()
        stats = calculate_stats(mock_tasks)
        return {
            "success": True,
            "message": "Tasks retrieved (mock data - error occurred)",
            "data": {
                **stats,
                "tasks": mock_tasks,
            }
        }
    finally:
        conn.close()
