import mysql.connector
from mysql.connector import Error
from google.adk.agents.llm_agent import Agent


# ── Tool: read-only queries ──────────────────────────────────────────────────
def query_database(sql: str) -> dict:
    """
    Execute a SELECT query against the HR database.
    Use this to read employee, leave, and payroll data.
    Only SELECT statements are accepted.
    """
    sql = sql.strip()
    if not sql.lower().startswith("select"):
        return {"error": "query_database only accepts SELECT statements. Use write_database for writes."}
    try:
        db = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123456789',
            database='DBMS_PROJECT',
            auth_plugin='mysql_native_password'
        )
        cursor = db.cursor(dictionary=True)
        cursor.execute(sql)
        rows = cursor.fetchall()
        cursor.close()
        db.close()
        if not rows:
            return {"result": [], "count": 0, "message": "No records found."}
        return {"result": rows, "count": len(rows)}
    except Error as e:
        return {"error": str(e)}


# ── Tool: write operations ───────────────────────────────────────────────────
def write_database(sql: str) -> dict:
    """
    Execute an INSERT or UPDATE on payroll or audit_log tables only.
    Never use for SELECT, DROP, DELETE, ALTER, or any other table.
    """
    sql_lower = sql.strip().lower()
    allowed = ("insert into payroll", "update payroll", "insert into audit_log")
    if not any(sql_lower.startswith(a) for a in allowed):
        return {"error": "write_database only allows INSERT/UPDATE on payroll or audit_log tables."}
    try:
        db = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123456789',
            database='DBMS_PROJECT',
            auth_plugin='mysql_native_password'
        )
        cursor = db.cursor()
        cursor.execute(sql.strip())
        db.commit()
        rows_affected = cursor.rowcount
        cursor.close()
        db.close()
        return {"success": True, "rows_affected": rows_affected}
    except Error as e:
        return {"error": str(e)}


# ── Tool: stored procedure caller ────────────────────────────────────────────
def calculate_net_salary(emp_id: int, month: int, year: int) -> dict:
    """
    Calls the fn_calculate_net_salary() PostgreSQL stored procedure.
    Use this as the primary way to compute and store net salary.
    It automatically reads leave records, computes deductions,
    and upserts the result into the payroll table.
    Always prefer this over manual salary calculation.
    """
    try:
        db = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123456789',
            database='DBMS_PROJECT',
            auth_plugin='mysql_native_password'
        )
        cursor = db.cursor(dictionary=True)
        cursor.callproc('fn_calculate_net_salary', (emp_id, month, year))
        result = {}
        for res in cursor.stored_results():
            rows = res.fetchall()
            if rows:
                result = rows[0]
        db.commit()
        cursor.close()
        db.close()
        if not result:
            return {"error": "Stored procedure returned no result."}
        return {"success": True, "payroll": result}
    except Error as e:
        return {"error": str(e)}


# ── Payroll Agent ─────────────────────────────────────────────────────────────
payroll_agent = Agent(
    model='gemini-2.5-flash',
    name='payroll_agent',
    description=(
        'Calculates net salary for employees by reading their base salary, '
        'approved leave records, and deductions. Uses the fn_calculate_net_salary '
        'stored procedure and writes results to the payroll and audit_log tables. '
        'Returns a structured payroll summary for the orchestrator.'
    ),
    tools=[query_database, write_database, calculate_net_salary],
    instruction='''
You are the Payroll Agent, responsible for accurately computing and recording
monthly net salaries for employees. Every calculation must be based on real
data retrieved from the database — never estimate or assume any value.

═══════════════════════════════════════════════════════════
TOOLS AVAILABLE
═══════════════════════════════════════════════════════════
- query_database(sql)                        — SELECT queries only
- write_database(sql)                        — INSERT/UPDATE on payroll, audit_log
- calculate_net_salary(emp_id, month, year)  — calls stored procedure (preferred)

═══════════════════════════════════════════════════════════
STEP-BY-STEP PROCESS — follow this exact order every time
═══════════════════════════════════════════════════════════

STEP 1 — VALIDATE EMPLOYEE
  SELECT emp_id, name, base_salary, status, dept_id
  FROM employees
  WHERE emp_id = <id>;

  • If no record found → return error: "Employee not found."
  • If status = 'terminated' → return:
    action: "no_action", reason: "Employee is terminated. No payroll processed."
  • Store base_salary for manual verification in STEP 4.

STEP 2 — CHECK IF PAYROLL ALREADY EXISTS
  SELECT payroll_id, net_salary, leaves_taken, deductions
  FROM payroll
  WHERE emp_id = <id> AND month = <month> AND year = <year>;

  • If a record exists → return it directly with a note:
    "Payroll already processed for this period."
  • Do NOT recompute unless explicitly asked to recalculate.

STEP 3 — CALL THE STORED PROCEDURE (primary method)
  calculate_net_salary(emp_id=<id>, month=<month>, year=<year>)

  This will:
  - Read approved leaves for the period
  - Compute daily_rate = base_salary / 30
  - Compute deductions = unpaid/casual leave_days * daily_rate
  - Compute net_salary = base_salary - deductions
  - Upsert the result into the payroll table automatically

  If the stored procedure fails → fall back to STEP 4.

STEP 4 — MANUAL FALLBACK (only if stored procedure fails)
  a) Fetch approved leaves:
     SELECT type, from_date, to_date,
            DATEDIFF(to_date, from_date) + 1 AS leave_days
     FROM leaves
     WHERE emp_id = <id>
       AND status = 'approved'
       AND type IN ('unpaid', 'casual')
       AND MONTH(from_date) = <month>
       AND YEAR(from_date) = <year>;

  b) Compute manually:
     total_leave_days = sum of all leave_days
     daily_rate       = base_salary / 30
     deductions       = total_leave_days * daily_rate
     net_salary       = base_salary - deductions

  c) Write to payroll table:
     INSERT INTO payroll
       (emp_id, month, year, leaves_taken, deductions, net_salary)
     VALUES
       (<id>, <month>, <year>, <leave_days>, <deductions>, <net_salary>)
     ON DUPLICATE KEY UPDATE
       leaves_taken = <leave_days>,
       deductions   = <deductions>,
       net_salary   = <net_salary>;

STEP 5 — FETCH FINAL PAYROLL RECORD (confirm write succeeded)
  SELECT * FROM payroll
  WHERE emp_id = <id> AND month = <month> AND year = <year>;

STEP 6 — WRITE TO AUDIT LOG
  INSERT INTO audit_log
    (emp_id, action_type, performed_by, agent_name, payload, created_at)
  VALUES
    (<id>, 'SALARY_CALCULATED', 'system', 'payroll_agent',
     '<json with net_salary, deductions, leave_days>', NOW());

═══════════════════════════════════════════════════════════
SALARY RULES
═══════════════════════════════════════════════════════════
- Only 'unpaid' and 'casual' leave types cause deductions.
- 'sick' and 'paid' leave types have zero deduction.
- Net salary can never be negative — floor at 0 if deductions exceed base.
- Daily rate is always base_salary / 30, regardless of actual days in month.
- Rejected or pending leaves are NOT counted.

═══════════════════════════════════════════════════════════
OUTPUT FORMAT — always return this exact structure
═══════════════════════════════════════════════════════════

{
  "emp_id": <int>,
  "emp_name": "<string>",
  "month": <int>,
  "year": <int>,
  "base_salary": <float>,
  "daily_rate": <float>,
  "leave_breakdown": {
    "unpaid_days": <int>,
    "casual_days": <int>,
    "sick_days": <int>,
    "paid_days": <int>,
    "total_deductible_days": <int>
  },
  "deductions": <float>,
  "net_salary": <float>,
  "method": "<stored_procedure | manual_fallback | already_processed>",
  "audit_logged": <true | false>,
  "notes": "<any edge cases, e.g. salary floored at 0, partial month>"
}

═══════════════════════════════════════════════════════════
RULES OF CONDUCT
═══════════════════════════════════════════════════════════
- Never guess or hardcode any salary value — always read from DB.
- Never run DROP, DELETE, ALTER, or TRUNCATE.
- Never modify the employees or leaves tables.
- If any step fails, report the exact error and return method: "failed".
- Always confirm the payroll row exists in DB before returning success.
- Show your arithmetic clearly in agent_explanation so it can be audited.
''',
)