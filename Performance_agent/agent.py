# agents/performance_agent.py

import os
import mysql.connector
from google.adk.agents.llm_agent import Agent
from google.adk.tools import FunctionTool


# ── DB connection ────────────────────────────────────────────────────────────

def get_db():
    return mysql.connector.connect(
       host='localhost',
            user='root',
            password='12345678',
            database='DBMS_PROJECT',
            auth_plugin='mysql_native_password'
    )


# ── Tools ────────────────────────────────────────────────────────────────────

def get_performance_history(emp_id: int, from_date: str, to_date: str) -> dict:
    """
    Fetch all performance review rows for an employee within a date range.

    Args:
        emp_id:     Employee ID.
        from_date:  Start date in YYYY-MM-DD format.
        to_date:    End date in YYYY-MM-DD format.

    Returns:
        A dict with employee name and a list of review records
        (score, strengths, weaknesses, reviewer_notes, review_date).
    """
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                e.name          AS employee_name,
                p.review_date,
                p.score,
                p.strengths,
                p.weaknesses,
                p.reviewer_notes
            FROM performance p
            JOIN employees e ON e.emp_id = p.emp_id
            WHERE p.emp_id = %s
              AND p.review_date BETWEEN %s AND %s
            ORDER BY p.review_date ASC
        """, (emp_id, from_date, to_date))

        rows = cursor.fetchall()

        if not rows:
            return {
                "error": f"No performance records found for emp_id={emp_id} "
                         f"in range {from_date} to {to_date}."
            }

        return {
            "emp_id":        emp_id,
            "employee_name": rows[0]["employee_name"],
            "reviews": [
                {
                    "review_date":    str(row["review_date"]),
                    "score":          float(row["score"]),
                    "strengths":      row["strengths"],
                    "weaknesses":     row["weaknesses"],
                    "reviewer_notes": row["reviewer_notes"],
                }
                for row in rows
            ],
        }
    finally:
        cursor.close()
        conn.close()


def get_task_completion_rate(emp_id: int, from_date: str, to_date: str) -> dict:
    """
    Calculate the task completion rate for an employee over a date range.

    Args:
        emp_id:     Employee ID.
        from_date:  Start date in YYYY-MM-DD format.
        to_date:    End date in YYYY-MM-DD format.

    Returns:
        A dict with total tasks, completed tasks, and completion percentage.
    """
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                COUNT(*)                                                AS total_tasks,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)  AS completed_tasks
            FROM tasks
            WHERE assigned_to = %s
              AND deadline BETWEEN %s AND %s
        """, (emp_id, from_date, to_date))

        row = cursor.fetchone()
        total     = row["total_tasks"]     or 0
        completed = row["completed_tasks"] or 0

        return {
            "emp_id":              emp_id,
            "total_tasks":         total,
            "completed_tasks":     completed,
            "completion_rate_pct": round((completed / total * 100), 1) if total > 0 else 0.0,
        }
    finally:
        cursor.close()
        conn.close()


def get_leave_summary(emp_id: int, from_date: str, to_date: str) -> dict:
    """
    Summarise approved leaves for an employee in a date range.

    Args:
        emp_id:     Employee ID.
        from_date:  Start date in YYYY-MM-DD format.
        to_date:    End date in YYYY-MM-DD format.

    Returns:
        A dict with total approved leaves broken down by type.
    """
    conn = get_db()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT type, COUNT(*) AS count
            FROM leaves
            WHERE emp_id    = %s
              AND status    = 'approved'
              AND from_date BETWEEN %s AND %s
            GROUP BY type
        """, (emp_id, from_date, to_date))

        rows      = cursor.fetchall()
        breakdown = {row["type"]: row["count"] for row in rows}

        return {
            "emp_id":          emp_id,
            "leave_breakdown": breakdown,
            "total_leaves":    sum(breakdown.values()),
        }
    finally:
        cursor.close()
        conn.close()


# ── Agent definition ─────────────────────────────────────────────────────────

performance_agent = Agent(
    model="gemini-2.5-flash",
    name="performance_agent",

    description=(
        "Analyses an employee's performance over a given date range. "
        "Fetches review scores, task completion rates, and leave patterns, "
        "then produces a structured summary with strengths, weaknesses, "
        "trend analysis, and a promotion/warning recommendation."
    ),

    instruction="""
You are the Performance Agent for an AI-powered HR Management System.

Your job is to evaluate an employee's performance over a requested date range
and return a clear, structured assessment that the HR Decision Agent (or a
human manager) can act on.

## What you MUST always do

1. Call `get_performance_history` to retrieve all review records in the range.
2. Call `get_task_completion_rate` to check how well the employee delivered.
3. Call `get_leave_summary` to understand attendance patterns.
4. Synthesise all three data sources into the output format below.

## Output format (always return this exact structure)

{
  "emp_id": <int>,
  "employee_name": "<string>",
  "date_range": {"from": "<YYYY-MM-DD>", "to": "<YYYY-MM-DD>"},
  "review_count": <int>,
  "average_score": <float, 0–10>,
  "score_trend": "improving" | "stable" | "declining",
  "highest_score": <float>,
  "lowest_score": <float>,
  "strengths": ["<key strength 1>", "<key strength 2>", ...],
  "weaknesses": ["<key weakness 1>", ...],
  "task_completion_rate_pct": <float>,
  "total_leaves": <int>,
  "leave_breakdown": { "sick": <int>, "casual": <int>, ... },
  "recommendation": "promote" | "salary_hike" | "no_action" | "warn" | "fire",
  "recommendation_reason": "<one concise paragraph explaining the recommendation>"
}

## Recommendation logic (use as a guide, apply judgment)

| Condition                                       | Recommendation |
|-------------------------------------------------|----------------|
| Avg score ≥ 8.5 AND task rate ≥ 80%             | promote        |
| Avg score 7–8.4 AND task rate ≥ 70%             | salary_hike    |
| Avg score 5–6.9 OR task rate 50–69%             | no_action      |
| Avg score 3–4.9 OR task rate < 50%              | warn           |
| Avg score < 3 OR task rate < 30% (2+ periods)   | fire           |

## Rules

- Never invent data. Only use what the tools return.
- If no reviews exist for the range, return an error message explaining this.
- Always derive `score_trend` from the chronological list of scores:
    - improving  → last score > first score by ≥ 0.5
    - declining  → last score < first score by ≥ 0.5
    - stable     → everything else
- Keep `recommendation_reason` factual and free of personal language.
- You are a sub-agent; the Orchestrator will combine your output with
  Payroll and Leave data before surfacing a final decision to the user.
""",

    tools=[
        FunctionTool(get_performance_history),
        FunctionTool(get_task_completion_rate),
        FunctionTool(get_leave_summary),
    ],
)