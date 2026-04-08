# AI-Driven HR Management System - Comprehensive Architecture

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Data Flow & System Integration](#data-flow--system-integration)
8. [Agent Workflows](#agent-workflows)
9. [API Design](#api-design)
10. [Security & Authentication](#security--authentication)
11. [Deployment Strategy](#deployment-strategy)

---

## 🎯 System Overview

The **AI-Driven HR Management System** is a comprehensive, full-stack employee management platform that combines:
- **Multi-Agent AI Backend**: Specialized AI agents (Google Gemini 2.5 Flash) for autonomous HR decision-making
- **Modern React Frontend**: Responsive, atomic-design dashboard for employees and managers
- **MySQL Database**: Centralized data store for employees, performance, payroll, tasks, and audit logs
- **Real-time Insights**: AI-generated recommendations for promotions, salary adjustments, and performance improvements

### Key Capabilities
✅ **Autonomous HR Decisions**: Agents analyze performance, attendance, and tasks to recommend promotions, warnings, or terminations  
✅ **Intelligent Payroll**: Automated salary calculations with leave deductions and tax handling  
✅ **Performance Analytics**: Trend analysis, strengths/weaknesses identification, and visual dashboards  
✅ **Smart Task Management**: Fair task distribution based on workload balancing  
✅ **Audit Trail**: Every decision is logged with AI-generated explanations for transparency  

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                                  │
│                    (React + Vite + Tailwind CSS)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │  Dashboard   │  │ Performance  │  │   Salary     │  │    Tasks     ││
│  │    Page      │  │     Page     │  │    Page      │  │    Page      ││
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘│
│         │                 │                 │                 │         │
│         └─────────────────┴─────────────────┴─────────────────┘         │
│                                   │                                     │
│                          ┌────────▼────────┐                           │
│                          │   API Service   │                           │
│                          │   (axios)       │                           │
│                          └────────┬────────┘                           │
└───────────────────────────────────┼──────────────────────────────────────┘
                                    │
                                    │ HTTP/REST
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                          API GATEWAY LAYER                               │
│                          (FastAPI - Planned)                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  Endpoints: /api/v1/employee/{id}/dashboard                        │ │
│  │            /api/v1/performance/analyze                              │ │
│  │            /api/v1/payroll/calculate                                │ │
│  │            /api/v1/tasks/assign, /api/v1/tasks/update              │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                   │                                     │
└───────────────────────────────────┼──────────────────────────────────────┘
                                    │
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                       MULTI-AGENT BACKEND LAYER                          │
│                    (Python + Google ADK + Gemini)                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │  HR Decision    │  │  Performance    │  │     Payroll     │         │
│  │     Agent       │  │     Agent       │  │      Agent      │         │
│  │ ────────────    │  │ ────────────    │  │ ────────────    │         │
│  │ • Promotes      │  │ • Trend         │  │ • Salary calc   │         │
│  │ • Warnings      │  │   analysis      │  │ • Leave         │         │
│  │ • Fires         │  │ • Scores        │  │   deductions    │         │
│  │ • Salary hikes  │  │ • Task rates    │  │ • Tax handling  │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
│           │                    │                    │                   │
│           └────────────────────┼────────────────────┘                   │
│                                │                                         │
│                      ┌─────────▼─────────┐                              │
│                      │  Task Manager     │                              │
│                      │      Agent        │                              │
│                      │ ──────────────    │                              │
│                      │ • Task assign     │                              │
│                      │ • Workload        │                              │
│                      │   balancing       │                              │
│                      │ • Status updates  │                              │
│                      └─────────┬─────────┘                              │
│                                │                                         │
└────────────────────────────────┼─────────────────────────────────────────┘
                                 │
                                 │ MySQL Connector
                                 │
┌────────────────────────────────▼─────────────────────────────────────────┐
│                          DATABASE LAYER                                  │
│                          (MySQL 8.0+)                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ employees  │  │performance │  │  payroll   │  │   tasks    │        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   leaves   │  │departments │  │ appraisals │  │ audit_log  │        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 18.x |
| **Vite** | Build tool & dev server | 5.x |
| **Tailwind CSS** | Utility-first styling | 3.x |
| **Recharts** | Data visualization | 2.x |
| **Lucide React** | Icon library | Latest |
| **Framer Motion** | Animations | Latest |
| **Axios** | HTTP client (planned) | Latest |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Python** | Runtime | 3.8+ |
| **Google ADK** | AI agent framework | Latest |
| **Gemini 2.5 Flash** | LLM model | Latest |
| **mysql-connector-python** | Database driver | 8.x |
| **FastAPI** | API framework (planned) | Latest |

### Database
| Technology | Purpose |
|------------|---------|
| **MySQL** | Primary data store (DBMS_PROJECT) |

---

## 🗄️ Database Schema

### Core Tables

#### 1. `employees`
```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL,
    base_salary FLOAT NOT NULL,
    status VARCHAR(20) NOT NULL,  -- 'active', 'terminated', 'on_leave'
    role VARCHAR(100),
    dept_id INT REFERENCES departments(dept_id)
);
```

#### 2. `performance`
```sql
CREATE TABLE performance (
    perf_id INT PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id),
    score FLOAT,  -- 0-10 scale
    strengths VARCHAR(100),
    weaknesses VARCHAR(100),
    review_date DATE,
    reviewer_notes VARCHAR(2500)
);
```

#### 3. `payroll`
```sql
CREATE TABLE payroll (
    payroll_id INT PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id),
    month VARCHAR(20),
    year INT,
    gross_salary FLOAT,
    leaves_taken FLOAT,
    deductions FLOAT,
    net_salary FLOAT
);
```

#### 4. `tasks`
```sql
CREATE TABLE tasks (
    task_id INT PRIMARY KEY,
    assigned_to INT REFERENCES employees(emp_id),
    assigned_by INT REFERENCES employees(emp_id),
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(20),  -- 'pending', 'in_progress', 'completed'
    deadline DATE
);
```

#### 5. `leaves`
```sql
CREATE TABLE leaves (
    leave_id INT PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id),
    leave_type VARCHAR(100),  -- 'sick', 'casual', 'earned', 'unpaid'
    from_date DATE,
    to_date DATE,
    status VARCHAR(20)  -- 'approved', 'pending', 'rejected'
);
```

#### 6. `appraisals`
```sql
CREATE TABLE appraisals (
    appraisal_id INT PRIMARY KEY,
    emp_id INT REFERENCES employees(emp_id),
    action VARCHAR(255),  -- 'promote', 'salary_hike', 'warn', 'fire', 'no_action'
    reason VARCHAR(255),
    agent_explanation VARCHAR(2500),
    action_date DATE,
    decided_by VARCHAR(100)  -- Agent name that made the decision
);
```

#### 7. `departments`
```sql
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    name VARCHAR(100),
    manager_id INT REFERENCES employees(emp_id)
);
```

#### 8. `audit_log` (Planned)
```sql
CREATE TABLE audit_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    action_type VARCHAR(100),
    performed_by VARCHAR(100),
    agent_name VARCHAR(100),
    payload TEXT,  -- JSON string of decision details
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🤖 Backend Architecture

### Multi-Agent System Design

The backend uses **specialized AI agents** powered by **Google Gemini 2.5 Flash** via the **Google ADK (Agent Development Kit)**. Each agent has:
- **Specific domain expertise** (HR, Payroll, Performance, Tasks)
- **Database access tools** (read-only queries + controlled writes)
- **Structured instructions** defining decision rules and workflows
- **Audit capabilities** to log all actions

### Agent Modules

#### 1. HR Decision Agent (`HR_DECISION/agent.py`)

**Purpose**: Makes final HR decisions (promote/warn/fire/salary_hike/no_action) based on comprehensive employee analysis.

**Tools**:
- `query_database(sql)` - SELECT queries only
- `write_database(sql)` - INSERT/UPDATE on appraisals and audit_log only

**Workflow**:
1. **Fetch employee basics**: status, tenure, base salary
2. **Analyze performance history**: last 6 reviews, compute average, trend (improving/stable/declining)
3. **Check leave records**: last 12 months of approved leaves
4. **Review payroll history**: last 6 months of salary consistency
5. **Evaluate task completion**: completion rate, overdue tasks
6. **Check prior appraisals**: recent warnings or promotions
7. **Compute weighted score** (0-100):
   ```
   Performance (40%) + Task Completion (25%) + Attendance (20%) + Tenure (15%)
   ```
8. **Apply decision rules**:
   - Score ≥80 + improving trend → **PROMOTE**
   - Score 65-79 + no warning → **SALARY_HIKE**
   - Score 50-64 or declining → **WARN**
   - Score 40-49 + prior warning → **FIRE**
   - Score <40 → **FIRE**
9. **Write decision** to appraisals table with AI-generated explanation

**Output Format**:
```json
{
  "emp_id": 42,
  "emp_name": "Priya Sharma",
  "action": "promote",
  "confidence": 0.92,
  "weighted_score": 87.5,
  "summary": {
    "average_performance_score": 9.2,
    "performance_trend": "improving",
    "task_completion_rate": 88.0,
    "unpaid_leave_days_12mo": 2,
    "recent_appraisals": ["salary_hike: 2026-01-15"]
  },
  "reason": "Consistently exceeds expectations with strong performance trend.",
  "agent_explanation": "Score breakdown: Perf=36.8/40, Tasks=22/25, Attendance=19.7/20, Tenure=9/15. No overrides triggered."
}
```

#### 2. Payroll Agent (`Payroll_Agent/agent.py`)

**Purpose**: Calculates monthly net salaries by factoring in base salary, approved leaves, and deductions.

**Tools**:
- `query_database(sql)`
- `write_database(sql)` - payroll/audit_log only
- `calculate_net_salary(emp_id, month, year)` - Calls MySQL stored procedure

**Workflow**:
1. Validate employee (active status check)
2. Check if payroll already processed for the period
3. Call stored procedure `fn_calculate_net_salary()`
4. Manual fallback if procedure fails:
   - Fetch approved unpaid/casual leaves for the month
   - Compute: `deductions = (base_salary / 30) × leave_days`
   - Compute: `net_salary = base_salary - deductions`
5. Write to payroll table
6. Log to audit_log

**Salary Rules**:
- Only 'unpaid' and 'casual' leaves cause deductions
- 'sick' and 'earned' leaves are fully paid
- Daily rate = base_salary / 30
- Net salary floored at 0 (never negative)

#### 3. Performance Agent (`Performance_agent/agent.py`)

**Purpose**: Analyzes employee performance over a date range and generates actionable insights.

**Tools**:
- `get_performance_history(emp_id, from_date, to_date)`
- `get_task_completion_rate(emp_id, from_date, to_date)`
- `get_leave_summary(emp_id, from_date, to_date)`

**Workflow**:
1. Fetch all performance reviews in the date range
2. Compute:
   - Average score
   - Trend (improving if last > first by ≥0.5)
   - Highest/lowest scores
   - Aggregate strengths and weaknesses
3. Fetch task completion rate
4. Fetch leave breakdown
5. Generate recommendation:
   - Avg score ≥8.5 + task rate ≥80% → **promote**
   - Avg score 7-8.4 + task rate ≥70% → **salary_hike**
   - Avg score 5-6.9 or task rate 50-69% → **no_action**
   - Avg score 3-4.9 or task rate <50% → **warn**
   - Avg score <3 or task rate <30% → **fire**

**Output Format**:
```json
{
  "emp_id": 42,
  "employee_name": "Priya Sharma",
  "date_range": {"from": "2025-10-01", "to": "2026-04-01"},
  "review_count": 3,
  "average_score": 8.7,
  "score_trend": "improving",
  "highest_score": 9.2,
  "lowest_score": 8.1,
  "strengths": ["Leadership", "Problem Solving"],
  "weaknesses": ["Time Management"],
  "task_completion_rate_pct": 86.5,
  "total_leaves": 5,
  "leave_breakdown": {"sick": 3, "casual": 2},
  "recommendation": "promote",
  "recommendation_reason": "Consistently high scores with improving trend and strong task delivery."
}
```

#### 4. Task Manager Agent (`task_manager/agent.py`)

**Purpose**: Assigns tasks fairly across departments and tracks task progress.

**Tools**:
- `get_department_employees(dept_id)` - Lists employees with open task counts
- `get_employee_tasks(emp_id, status)` - Fetches tasks for an employee
- `assign_task(assigned_to, assigned_by, title, description, deadline)`
- `update_task_status(task_id, new_status)`
- `get_department_workload_summary(dept_id)`

**Workflow**:
1. Before assigning, check department workload
2. Identify employee with fewest open tasks
3. Assign task to that employee
4. Default deadline: 7 days from today if not specified
5. Update task status as employees progress

**Task Assignment Rules**:
- NEVER assign to terminated or on_leave employees
- Prefer least-loaded employee (by open task count)
- If tied, prefer employee with earlier existing deadline

---

## 🎨 Frontend Architecture

### Atomic Design Pattern

The frontend follows **strict atomic design** for maximum reusability and consistency.

```
frontend/src/
├── components/
│   ├── Layout/
│   │   ├── AppLayout.jsx       # Main shell (Sidebar + Navbar + Content)
│   │   ├── MainContainer.jsx   # Fluid content wrapper (calc(100% - 260px))
│   │   ├── Navbar.jsx          # Top navigation
│   │   └── Sidebar.jsx         # Fixed left menu
│   ├── Sections/
│   │   ├── WelcomeSection.jsx  # Greeting + context
│   │   ├── StatsGrid.jsx       # Key metrics cards
│   │   ├── ChartSection.jsx    # Performance charts
│   │   ├── TableSection.jsx    # Task tables
│   │   └── InsightSection.jsx  # AI insights
│   ├── Card/Card.jsx           # Reusable container
│   ├── Badge/Badge.jsx         # Status indicators
│   ├── Table/Table.jsx         # Generic table
│   ├── Button/Button.jsx       # Action buttons
│   ├── Input/Input.jsx         # Form inputs
│   ├── Select/Select.jsx       # Dropdowns
│   ├── InsightBox/InsightBox.jsx  # AI insight display
│   └── PerformanceChart.jsx    # Recharts line chart
├── pages/
│   ├── EmployeeDashboard.jsx   # Overview page
│   ├── EmployeePerformance.jsx # Performance analytics
│   ├── EmployeeSalary.jsx      # Compensation details
│   └── EmployeeTasks.jsx       # Task management
├── hooks/
│   ├── useDashboardData.js     # Dashboard data fetcher
│   ├── useTasks.js             # Task data fetcher
│   ├── usePerformance.js       # Performance data fetcher
│   └── useSalary.js            # Salary data fetcher
├── services/
│   └── api.js                  # API client (currently mocked)
└── App.jsx                     # Root component
```

### Design System

**Primary Color**: Indigo (`#4F46E5`)  
**Layout**: Full-width fluid design (no max-width constraints)  
**Responsiveness**: Mobile-first with Tailwind breakpoints  
**Typography**: Clean, hierarchical headings  

### Page Descriptions

#### 1. **EmployeeDashboard.jsx**
- **Purpose**: Central hub for employee overview
- **Displays**:
  - Welcome message with employee name
  - Stats grid (Performance Score, Active Tasks, Monthly Salary)
  - Performance trend chart (last 6 months)
  - Recent tasks table
  - AI-generated insights from HR Decision Agent

#### 2. **EmployeePerformance.jsx**
- **Purpose**: Detailed performance analytics
- **Displays**:
  - Historical performance scores (line chart)
  - Strengths & weaknesses breakdown
  - Task completion rate trends
  - Leave impact analysis
  - AI recommendations (promote/warn/etc.)

#### 3. **EmployeeSalary.jsx**
- **Purpose**: Comprehensive compensation view
- **Displays**:
  - Current month's salary breakdown
  - Gross vs. net salary
  - Leave deductions table
  - Salary history (last 12 months)
  - Bonus/appraisal records

#### 4. **EmployeeTasks.jsx**
- **Purpose**: Task management interface
- **Features**:
  - Filterable task list (pending/in_progress/completed)
  - Task status updates
  - Deadline tracking
  - Overdue task highlighting
  - Task assignment history

---

## 🔄 Data Flow & System Integration

### Current State (Disconnected)

**Frontend**:
- Uses custom hooks that return **mock/static data**
- `api.js` resolves promises with hardcoded JSON
- UI is fully functional but not connected to backend

**Backend**:
- Agents run independently via CLI
- Direct MySQL database access
- No HTTP API exposed

### Integration Plan (Future State)

#### Step 1: Add FastAPI to `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/employee/{emp_id}/dashboard")
async def get_dashboard(emp_id: int):
    # Call Performance Agent for scores
    # Call Payroll Agent for salary
    # Call Task Manager for active tasks
    # Call HR Decision Agent for insights
    return {
        "employee": {...},
        "performance": {...},
        "salary": {...},
        "tasks": [...],
        "insights": [...]
    }
```

#### Step 2: Update Frontend `api.js`

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export const fetchDashboardData = async (empId) => {
  const response = await axios.get(`${API_BASE}/employee/${empId}/dashboard`);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await axios.patch(`${API_BASE}/tasks/${taskId}`, { status });
  return response.data;
};
```

#### Step 3: Connect Hooks to API

```javascript
// hooks/useDashboardData.js
import { useEffect, useState } from 'react';
import { fetchDashboardData } from '../services/api';

export const useDashboardData = (empId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData(empId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [empId]);

  return { data, loading };
};
```

### Complete Data Flow

```
User Action (Frontend)
    ↓
React Component triggers event
    ↓
Custom Hook calls api.js function
    ↓
Axios sends HTTP request to FastAPI
    ↓
FastAPI endpoint validates request
    ↓
FastAPI invokes appropriate AI Agent(s)
    ↓
Agent calls tools (query_database/write_database)
    ↓
MySQL database processes query
    ↓
Agent processes results with LLM reasoning
    ↓
Agent returns structured JSON
    ↓
FastAPI formats response
    ↓
Axios receives response
    ↓
Custom Hook updates React state
    ↓
Component re-renders with new data
    ↓
User sees updated UI
```

---

## 🔁 Agent Workflows

### Workflow 1: Monthly Performance Review

```
1. HR Manager triggers review for emp_id=42, date_range=2025-10-01 to 2026-04-01

2. FastAPI calls Performance Agent

3. Performance Agent:
   ├─ Calls get_performance_history(42, '2025-10-01', '2026-04-01')
   ├─ Calls get_task_completion_rate(42, '2025-10-01', '2026-04-01')
   ├─ Calls get_leave_summary(42, '2025-10-01', '2026-04-01')
   └─ LLM synthesizes data into recommendation

4. Returns:
   {
     "average_score": 8.7,
     "score_trend": "improving",
     "task_completion_rate_pct": 86.5,
     "recommendation": "promote",
     "recommendation_reason": "Consistently high scores..."
   }

5. FastAPI sends to frontend → displays in PerformanceChart + InsightBox
```

### Workflow 2: Monthly Payroll Calculation

```
1. System triggers payroll for all active employees for month=March, year=2026

2. For each employee:
   FastAPI calls Payroll Agent

3. Payroll Agent:
   ├─ Validates employee status
   ├─ Checks if payroll already exists
   ├─ Calls calculate_net_salary(emp_id, 3, 2026)
   │     ├─ Stored procedure reads base_salary from employees
   │     ├─ Fetches approved unpaid/casual leaves for March 2026
   │     ├─ Computes deductions = (base_salary/30) × leave_days
   │     ├─ Computes net_salary = base_salary - deductions
   │     └─ Upserts into payroll table
   └─ Logs action to audit_log

4. Returns:
   {
     "emp_id": 42,
     "month": 3,
     "year": 2026,
     "base_salary": 75000,
     "deductions": 5000,
     "net_salary": 70000,
     "method": "stored_procedure"
   }

5. Frontend displays in EmployeeSalary.jsx
```

### Workflow 3: Task Assignment

```
1. Manager wants to assign "Database Migration" to Engineering dept (dept_id=2)

2. FastAPI calls Task Manager Agent

3. Task Manager Agent:
   ├─ Calls get_department_employees(2)
   │     └─ Returns: [
   │           {emp_id: 5, name: "Arjun", open_tasks: 2},
   │           {emp_id: 12, name: "Priya", open_tasks: 5},
   │           {emp_id: 23, name: "Vikram", open_tasks: 3}
   │         ]
   ├─ Identifies Arjun (least loaded: 2 open tasks)
   ├─ Calls assign_task(
   │     assigned_to=5,
   │     assigned_by=1,
   │     title="Database Migration",
   │     description="Migrate to MySQL 8.0",
   │     deadline="2026-04-14"  # 7 days from today
   │   )
   └─ Returns success confirmation

4. Returns:
   {
     "action": "task_assigned",
     "task_id": 156,
     "assigned_to_name": "Arjun",
     "reason": "Arjun has the fewest open tasks (2 vs team avg 3.3)"
   }

5. Frontend updates EmployeeTasks.jsx for Arjun
```

### Workflow 4: HR Decision Making

```
1. Quarterly review triggers HR Decision Agent for emp_id=42

2. HR Decision Agent executes 6-step analysis:

   STEP 1: Fetch employee basics
   ├─ SELECT emp_id, name, role, base_salary, status, joining_date
   │  FROM employees WHERE emp_id = 42
   └─ Result: {name: "Priya", tenure: 18 months, base_salary: 75000}

   STEP 2: Fetch performance history (last 6 reviews)
   ├─ SELECT score, review_date FROM performance
   │  WHERE emp_id = 42 ORDER BY review_date DESC LIMIT 6
   └─ Result: avg_score=8.7, trend="improving"

   STEP 3: Fetch leave record (last 12 months)
   ├─ SELECT type, from_date, to_date FROM leaves
   │  WHERE emp_id = 42 AND status = 'approved'
   └─ Result: unpaid_leave_days=2

   STEP 4: Fetch payroll history (last 6 months)
   ├─ SELECT net_salary, deductions FROM payroll
   │  WHERE emp_id = 42 ORDER BY year DESC, month DESC LIMIT 6
   └─ Result: salary_consistency="consistent"

   STEP 5: Fetch task completion
   ├─ SELECT status, COUNT(*) FROM tasks
   │  WHERE assigned_to = 42 GROUP BY status
   └─ Result: completion_rate=86.5%

   STEP 6: Fetch recent appraisals
   ├─ SELECT action, action_date FROM appraisals
   │  WHERE emp_id = 42 ORDER BY action_date DESC LIMIT 3
   └─ Result: last_action="salary_hike" (90 days ago)

3. Compute weighted score:
   ├─ Performance: (8.7/10) × 40 = 34.8
   ├─ Task completion: (86.5/100) × 25 = 21.6
   ├─ Attendance: (1 - 2/30) × 20 = 18.7
   ├─ Tenure: (18/24) × 15 = 11.2
   └─ TOTAL: 86.3

4. Apply decision rules:
   ├─ Score = 86.3 ≥ 80 ✓
   ├─ Trend = "improving" ✓
   └─ Decision: PROMOTE

5. Write to appraisals table:
   INSERT INTO appraisals (emp_id, action, reason, agent_explanation, ...)
   VALUES (42, 'promote', 'Consistently exceeds...', 'Score: 86.3, breakdown...', ...)

6. Write to audit_log:
   INSERT INTO audit_log (emp_id, action_type, agent_name, payload, ...)

7. Return to frontend → displays in InsightBox:
   "🎉 Recommended Action: Promote Priya Sharma to Senior Engineer"
```

---

## 🔌 API Design (Planned)

### Endpoint Structure

```
Base URL: http://localhost:8000/api/v1
```

#### Employee Endpoints
```
GET    /employee/{emp_id}/dashboard       # Full dashboard data
GET    /employee/{emp_id}/performance     # Performance analytics
GET    /employee/{emp_id}/salary          # Salary details
GET    /employee/{emp_id}/tasks           # Task list
```

#### Agent Endpoints
```
POST   /hr/analyze                        # Trigger HR Decision Agent
POST   /payroll/calculate                 # Calculate payroll for month
POST   /performance/review                # Generate performance review
POST   /tasks/assign                      # Assign new task
PATCH  /tasks/{task_id}/status            # Update task status
```

#### Department Endpoints
```
GET    /department/{dept_id}/workload     # Department workload summary
GET    /department/{dept_id}/employees    # List employees in dept
```

### Example Request/Response

**Request**:
```http
POST /api/v1/hr/analyze
Content-Type: application/json

{
  "emp_id": 42
}
```

**Response**:
```json
{
  "emp_id": 42,
  "emp_name": "Priya Sharma",
  "action": "promote",
  "confidence": 0.92,
  "weighted_score": 86.3,
  "summary": {
    "average_performance_score": 8.7,
    "performance_trend": "improving",
    "task_completion_rate": 86.5,
    "unpaid_leave_days_12mo": 2,
    "recent_appraisals": ["salary_hike: 2026-01-15"]
  },
  "reason": "Consistently exceeds expectations with strong performance trend and high task delivery rate.",
  "agent_explanation": "Weighted score breakdown: Performance=34.8/40, Tasks=21.6/25, Attendance=18.7/20, Tenure=11.2/15. Total=86.3. No override rules triggered. Decision: PROMOTE per rule (score ≥80 AND trend='improving')."
}
```

---

## 🔒 Security & Authentication

### Current State
- No authentication implemented
- Database credentials hardcoded in agent files
- Direct MySQL access from agents

### Planned Security Measures

1. **Authentication**: JWT-based auth for frontend
2. **Authorization**: Role-based access (Employee, Manager, HR Admin)
3. **Environment Variables**: Move DB credentials to `.env` files
4. **SQL Injection Prevention**: Parameterized queries only (already implemented)
5. **Audit Logging**: All agent actions logged to audit_log table
6. **Rate Limiting**: Prevent API abuse
7. **Data Encryption**: Encrypt sensitive fields (salary, email)

---

## 🚀 Deployment Strategy

### Development
```
Frontend: npm run dev (http://localhost:5173)
Backend:  python main.py (http://localhost:8000)
Database: MySQL on localhost:3306
```

### Production (Recommended)

**Frontend**:
- Build: `npm run build`
- Deploy: Vercel/Netlify (static hosting)

**Backend**:
- Container: Docker image with Python + dependencies
- Deploy: AWS EC2 / Google Cloud Run
- Process manager: Gunicorn/Uvicorn workers

**Database**:
- Managed MySQL: AWS RDS / Google Cloud SQL
- Backups: Automated daily snapshots

**Architecture**:
```
Cloudflare CDN → React (Vercel)
                       ↓
                   API Gateway (AWS)
                       ↓
           Load Balancer → FastAPI (Docker)
                       ↓
                   MySQL (RDS)
```

---

## 📊 System Metrics

- **Database**: 8 tables, ~100 employees, ~100 tasks, ~100 performance reviews
- **Agents**: 4 specialized AI agents (HR, Payroll, Performance, Task Manager)
- **LLM**: Google Gemini 2.5 Flash (fast, cost-effective)
- **Frontend**: 4 pages, 15+ reusable components
- **Response Time**: <2s for agent decisions (typical)
- **Accuracy**: AI decisions auditable via agent_explanation field

---

## 🎯 Future Enhancements

1. **Real-time Notifications**: WebSocket support for task updates
2. **Advanced Analytics**: Predictive models for attrition risk
3. **Multi-language Support**: i18n for global teams
4. **Mobile App**: React Native companion app
5. **Integration**: Slack/Email notifications for appraisals
6. **Chatbot Interface**: Natural language HR queries
7. **Performance Trends**: ML-based anomaly detection

---

**Last Updated**: 2026-04-07  
**Version**: 1.0  
**Maintained By**: HR System Development Team
