# agents/task_planner_agent.py

import os
from datetime import date
from google.adk.agents.llm_agent import Agent
from google.adk.tools import FunctionTool
import mysql.connector


# ── DB connection ─────────────────────────────────────────────────────────────

def get_db():
    return mysql.connector.connect(
        host='localhost',
            user='root',
            password='12345678',
            database='DBMS_PROJECT',
            auth_plugin='mysql_native_password'
    )


# ── Tools ─────────────────────────────────────────────────────────────────────

def get_department_employees(dept_id: int) -> dict:
    """
    Fetch all active employees in a department along with their current
    open task count (pending + in_progress).

    Args:
        dept_id: The department ID to query.

    Returns:
        Dict with department name and list of employees with their workload.
    """
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT name FROM departments WHERE dept_id = %s", (dept_id,))
        dept_row = cursor.fetchone()
        if not dept_row:
            return {"error": f"No department found with dept_id={dept_id}."}

        cursor.execute("""
            SELECT
                e.emp_id,
                e.name,
                e.role,
                COUNT(t.task_id) AS open_tasks
            FROM employees e
            LEFT JOIN tasks t
                ON t.assigned_to = e.emp_id
                AND t.status IN ('pending', 'in_progress')
            WHERE e.dept_id = %s
              AND e.status = 'active'
            GROUP BY e.emp_id, e.name, e.role
            ORDER BY open_tasks ASC
        """, (dept_id,))

        employees = cursor.fetchall()

        return {
            "dept_id":         dept_id,
            "department_name": dept_row["name"],
            "employees":       employees,
            "total_active":    len(employees),
        }
    finally:
        conn.close()


def get_employee_tasks(emp_id: int, status: str = None) -> dict:
    """
    Fetch tasks assigned to a specific employee, optionally filtered by status.

    Args:
        emp_id:  Employee ID.
        status:  Optional — 'pending', 'in_progress', or 'completed'.
                 If None, returns all tasks.

    Returns:
        Dict with employee name and their task list.
    """
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT name FROM employees WHERE emp_id = %s", (emp_id,))
        emp = cursor.fetchone()
        if not emp:
            return {"error": f"No employee found with emp_id={emp_id}."}

        if status:
            cursor.execute("""
                SELECT task_id, title, description, status, deadline
                FROM tasks
                WHERE assigned_to = %s AND status = %s
                ORDER BY deadline ASC
            """, (emp_id, status))
        else:
            cursor.execute("""
                SELECT task_id, title, description, status, deadline
                FROM tasks
                WHERE assigned_to = %s
                ORDER BY deadline ASC
            """, (emp_id,))

        tasks = cursor.fetchall()

        # Convert date objects to strings for JSON serialisation
        for t in tasks:
            if t["deadline"] and isinstance(t["deadline"], date):
                t["deadline"] = str(t["deadline"])

        return {
            "emp_id":        emp_id,
            "employee_name": emp["name"],
            "tasks":         tasks,
            "task_count":    len(tasks),
        }
    finally:
        conn.close()


def assign_task(
    assigned_to: int,
    assigned_by: int,
    title: str,
    description: str,
    deadline: str,
) -> dict:
    """
    Create and assign a new task to an employee.

    Args:
        assigned_to:  emp_id of the employee receiving the task.
        assigned_by:  emp_id of the manager assigning the task.
        title:        Short task title (max 200 chars).
        description:  Full task description.
        deadline:     Due date in YYYY-MM-DD format.

    Returns:
        Dict confirming the created task with its new task_id.
    """
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)

        # Validate both employees exist
        cursor.execute(
            "SELECT name FROM employees WHERE emp_id = %s AND status = 'active'",
            (assigned_to,)
        )
        recipient = cursor.fetchone()
        if not recipient:
            return {"error": f"emp_id={assigned_to} is not an active employee."}

        cursor.execute(
            "SELECT name FROM employees WHERE emp_id = %s", (assigned_by,)
        )
        assigner = cursor.fetchone()
        if not assigner:
            return {"error": f"emp_id={assigned_by} not found."}

        cursor.execute("""
            INSERT INTO tasks (assigned_to, assigned_by, title, description, status, deadline)
            VALUES (%s, %s, %s, %s, 'pending', %s)
        """, (assigned_to, assigned_by, title, description, deadline))

        conn.commit()
        task_id = cursor.lastrowid

        return {
            "success":       True,
            "task_id":       task_id,
            "assigned_to":   recipient["name"],
            "assigned_by":   assigner["name"],
            "title":         title,
            "deadline":      deadline,
            "status":        "pending",
        }
    finally:
        conn.close()


def update_task_status(task_id: int, new_status: str) -> dict:
    """
    Update the status of an existing task.

    Args:
        task_id:    ID of the task to update.
        new_status: One of 'pending', 'in_progress', 'completed'.

    Returns:
        Dict confirming the update.
    """
    valid_statuses = {"pending", "in_progress", "completed"}
    if new_status not in valid_statuses:
        return {"error": f"Invalid status '{new_status}'. Must be one of {valid_statuses}."}

    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT task_id, title, assigned_to FROM tasks WHERE task_id = %s",
            (task_id,)
        )
        task = cursor.fetchone()
        if not task:
            return {"error": f"No task found with task_id={task_id}."}

        cursor.execute(
            "UPDATE tasks SET status = %s WHERE task_id = %s",
            (new_status, task_id)
        )
        conn.commit()

        return {
            "success":   True,
            "task_id":   task_id,
            "title":     task["title"],
            "new_status": new_status,
        }
    finally:
        conn.close()


def get_department_workload_summary(dept_id: int) -> dict:
    """
    Get a high-level workload summary for an entire department —
    how many tasks are pending, in_progress, and completed.
    Useful for the agent to decide how to distribute new work.

    Args:
        dept_id: The department ID.

    Returns:
        Dict with task status counts across the whole department.
    """
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                t.status,
                COUNT(*) AS count
            FROM tasks t
            JOIN employees e ON e.emp_id = t.assigned_to
            WHERE e.dept_id = %s
              AND e.status  = 'active'
            GROUP BY t.status
        """, (dept_id,))

        rows = cursor.fetchall()
        summary = {row["status"]: row["count"] for row in rows}

        return {
            "dept_id":     dept_id,
            "pending":     summary.get("pending",     0),
            "in_progress": summary.get("in_progress", 0),
            "completed":   summary.get("completed",   0),
            "total":       sum(summary.values()),
        }
    finally:
        conn.close()


# ── Agent definition ──────────────────────────────────────────────────────────

task_planner_agent = Agent(
    model="gemini-2.5-flash",
    name="task_planner_agent",

    description=(
        "Plans and manages task assignments across a department. "
        "Checks current employee workloads, assigns new tasks to the least-loaded "
        "active employees, updates task statuses, and provides workload summaries "
        "to the Orchestrator Agent."
    ),

    instruction="""
You are the Task Planner Agent for an AI-powered HR Management System.

Your job is to intelligently assign and track tasks within a department,
always distributing work fairly based on current employee workloads.

## What you MUST always do

1. Before assigning any task, call `get_department_employees` to see current
   open task counts per employee — always assign to the least-loaded person.
2. Call `get_department_workload_summary` when asked for an overview of how
   busy a department is.
3. Call `get_employee_tasks` when asked about a specific employee's tasks.
4. Call `assign_task` to create and assign a new task.
5. Call `update_task_status` when a task's progress needs to be recorded.

## Task assignment rules

- NEVER assign a task to a terminated or on_leave employee.
- Prefer employees with the fewest open (pending + in_progress) tasks.
- If two employees are equally loaded, prefer the one with the earlier
  existing deadline (they are used to urgency).
- Deadlines must always be a future date in YYYY-MM-DD format.
- If the caller does not specify a deadline, default to 7 days from today
  and mention this in your response.

## Output format (always return this exact structure)

For task assignments:
{
  "action": "task_assigned",
  "task_id": <int>,
  "assigned_to_emp_id": <int>,
  "assigned_to_name": "<string>",
  "title": "<string>",
  "deadline": "<YYYY-MM-DD>",
  "reason": "<one sentence explaining why this employee was chosen>"
}

For workload summaries:
{
  "action": "workload_summary",
  "dept_id": <int>,
  "department_name": "<string>",
  "pending": <int>,
  "in_progress": <int>,
  "completed": <int>,
  "employees": [ { "name": "...", "open_tasks": <int> }, ... ]
}

For status updates:
{
  "action": "status_updated",
  "task_id": <int>,
  "title": "<string>",
  "new_status": "<string>"
}

## Rules

- Never invent employee names, task IDs, or dept IDs — only use what the tools return.
- You are a sub-agent; the Orchestrator will call you as part of a larger flow.
- Keep `reason` fields factual (e.g. "Assigned to Priya as she has the fewest
  open tasks in the department (2 vs team average of 5)").
""",

    tools=[
        FunctionTool(get_department_employees),
        FunctionTool(get_employee_tasks),
        FunctionTool(assign_task),
        FunctionTool(update_task_status),
        FunctionTool(get_department_workload_summary),
    ],
)