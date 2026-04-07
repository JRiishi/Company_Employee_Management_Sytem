# HR System Architecture

## System Overview
The HR System is a full-stack application featuring a multi-agent Python backend for intelligent HR operations and a scalable, atomic-component-based React frontend for the Employee Dashboard.

## 1. Frontend Architecture (React + Vite + Tailwind CSS)
The frontend strictly follows an atomic design pattern to ensure maximum reusability and a consistent enterprise-grade UI (Primary Theme: Blue `#2563EB`).

### Directory Structure & Components
*   **Pages (`/frontend/src/pages/`)**
    *   `EmployeeDashboard.jsx`: The main orchestrator. Manages application state, handles (currently mocked) data fetching, and composes the layout sections.
*   **Sections (`/frontend/src/components/Sections/`)**
    *   `WelcomeSection.jsx`: User greeting and high-level context.
    *   `StatsGrid.jsx`: Key metrics display.
    *   `ChartSection.jsx`: Layout boundary (420px height constraint) for performance visualizations.
    *   `TableSection.jsx`: Layout boundary (420px height constraint) for recent tasks.
*   **Base UI Components (`/frontend/src/components/`)**
    *   `Card/Card.jsx`: Reusable container with consistent padding, borders, and optional hover states.
    *   `Badge/Badge.jsx`: Dynamic status indicators mapping text to colors (Success, Warning, Danger, Default).
    *   `Table/Table.jsx`: Highly generic, data-agnostic table block resolving dynamic columns, empty states, and row click handlers.
    *   `PerformanceChart.jsx`: Recharts-based strict time-series `<LineChart>` rendering performance scores.

## 2. Backend Architecture (Python + Google ADK + MySQL)
The backend is driven by intelligent agents utilizing LLMs to process HR data, manage tasks, and generate insights.

### Directory Structure & Agents
*   **Agent Modules**
    *   `HR_DECISION/agent.py`: Evaluates and decides HR actions.
    *   `MySQL_Commnad/agent.py`: Natural language to SQL translation/execution interactions.
    *   `Payroll_Agent/agent.py`: Handles salary, automated payroll execution, and adjustments.
    *   `Performance_agent/agent.py`: Analyzes employee performance metrics.
    *   `task_manager/agent.py`: Allocates, tracks, and updates employee tasks.
*   **Core Scripts**
    *   `main.py`: Entry point for backend operations / future API routing (FastAPI).
    *   `connect.py`: MySQL database connection handler.
    *   `insert.py`: Data seeding and insertion operations.

## 3. Data Flow (Current & Planned)
1.  **Current State:** The frontend operates on internal mock Promises simulating API latency to ensure UI stability. The Python backend operates independently via CLI/Scripts.
2.  **Next Phase:** Introduce **FastAPI** to `main.py` to expose routes (e.g., `/api/employee/dashboard`, `/api/tasks/recent`). The React frontend will replace Promises with `axios` intercepts to dynamically fetch MySQL data via the Python agents.
