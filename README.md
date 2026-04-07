# Company Employee Management System

A comprehensive, AI-driven Employee Management System built as a modern web application. This system integrates specialized AI agents for different HR domains and provides a sleek, responsive dashboard for employees to manage their tasks, view performance metrics, and track their compensation.

## 🚀 Features

- **Multi-Agent Architecture**
  - **HR Decision Agent**: Assists with overarching HR decisions and analytics.
  - **Payroll Agent**: Manages employee compensation and salary structures.
  - **Performance Agent**: Tracks and evaluates employee performance metrics.
  - **Task Manager Agent**: Handles employee task assignment and progress tracking.

- **Modern Employee Dashboard**
  - **Dashboard**: A central hub for employee overview.
  - **Performance Analytics**: Visual data representations using Recharts.
  - **Salary Hub**: Overview of compensation.
  - **Task Management**: Interface for managing day-to-day tasks.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for icons
- [Framer Motion](https://www.framer.com/motion/) for animations

**Backend/Agents:**
- Python 3
- Custom Multi-Agent AI System

## 📂 Project Structure

```
DBMS_PROJECT/
├── frontend/                 # Vite + React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Dashboard pages (Performance, Salary, Tasks)
│   │   ├── hooks/            # Custom React hooks for data fetching
│   │   └── services/         # API integration
│   └── package.json
├── HR_DECISION/              # HR Decision Agent module
├── Payroll_Agent/            # Payroll Agent module
├── Performance_agent/        # Performance Agent module
├── task_manager/             # Task Manager Agent module
├── main.py                   # Main backend entry point
├── connect.py                # Database connection utilities
└── insert.py                 # Database seeding/insertion scripts
```

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended for Vite)
- [Python 3.8+](https://www.python.org/)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

### Backend Setup

1. From the project root, activate your virtual environment:
   ```bash
   # On macOS/Linux
   source venv/bin/activate
   # On Windows
   venv\Scripts\activate
   ```
2. Ensure you have the necessary variables set in your `.env` file (which is ignored by Git for security).
3. Run the backend application:
   ```bash
   python main.py
   ```

## 📄 License

This project is licensed under the MIT License.
