# Company Employee Management System

A comprehensive Employee Management System built with FastAPI backend and React frontend, featuring employee dashboards, task management, leave tracking, and admin panel for HR management.

## 🚀 Features

### Employee Dashboard

- **Employee Overview Tab**: View employee details including joining date, performance score, and quick stats
- **Task Management Tab**: Track assigned tasks with filtering by time period (Week/Month/Year)
  - Task statistics (Total, Completed, Pending, Ongoing)
  - Task completion rate visualization
  - Sortable task list (by Date or Status)
- **Leave Management Tab**: View and track leave records with status breakdown
  - Leave stats showing Approved, Pending, and Rejected leave days
  - Leave breakdown by type (Sick Leave, Casual Leave, Vacation Leave, PTO)
  - Leave records table with detailed information

### Admin Panel

- **Employee Management**: 
  - View all employees with comprehensive data (name, email, department, salary, performance)
  - Search and filter employees by department, status, performance, salary
  - Bulk actions (Mark Active/Inactive, Delete)
  - Employee termination with confirmation dialog
  - Export employee data to CSV
  - Expandable rows showing employee tasks and leave summary

- **Employee Details View**: 
  - Tabbed interface (Overview, Tasks, Leave)
  - Terminate employee from details page
  - View employee performance, salary, joining date
  - Access employee tasks and leave records

- **Admin Dashboard**:
  - System overview with key statistics
  - Pending approvals queue (New Employees, Leave Requests, Role Changes)
  - Recent activity feed
  - Random employee names for pending approvals
  - Alert management
  - Advanced admin settings with RBAC

- **New Employee Management**:
  - Approve new employee requests from the admin dashboard
  - New employees automatically assigned unique data (salary, department, performance)
  - New employees integrated into all employee views
  - Persistent storage across page refreshes and logout

- **Leave Management**: Track employee leave requests and approvals
- **Responsive Design**: Optimized for desktop and tablet screens

### Leave System

- **4 Leave Types**:
  - Sick Leave (Medical appointments, Illness, Doctor visits)
  - Casual Leave (Personal reasons, Rest and relax)
  - Vacation Leave (Travel, Holiday trips)
  - Paid Time Off (PTO) (Personal time off)
- **Status Tracking**: Approved, Pending, Rejected
- **Contextual Leave Reasons**: Different reason options per leave type

## 🛠️ Tech Stack

**Frontend:**

- [React 18](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) for icons
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Axios](https://axios-http.com/) for HTTP requests

**Backend:**

- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [MySQL](https://www.mysql.com/) - Database
- JWT-based authentication
- Mock data generation with deterministic seeding

## 📂 Project Structure

```
Company_Employee_Management_Sytem/
├── frontend/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/          # Sidebar, Header components
│   │   │   ├── TaskDashboard/   # Task management component
│   │   │   └── EmployeeLeave/   # Leave management component
│   │   ├── pages/
│   │   │   ├── EmployeeDashboard.jsx      # Employee list
│   │   │   ├── EmployeeDetails.jsx        # Tabbed employee details
│   │   │   ├── AdminDashboard.jsx         # Admin overview
│   │   │   └── Login.jsx                  # Authentication
│   │   ├── services/
│   │   │   └── api.js           # API integration
│   │   └── App.jsx
│   ├── package.json
│   └── index.html
├── backend/
│   ├── routes/
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── admin.py             # Admin panel endpoints
│   │   ├── tasks.py             # Task management endpoints
│   │   ├── leaves.py            # Leave management endpoints
│   │   └── employees.py         # Employee data endpoints
│   ├── models/
│   │   ├── models.py            # SQLAlchemy models
│   │   └── schemas.py           # Pydantic schemas
│   ├── main.py                  # FastAPI application entry
│   ├── config.py                # Configuration
│   ├── database.py              # Database connection
│   └── requirements.txt
├── README.md
└── .env                         # Environment variables (not in git)
```

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Python 3.8+](https://www.python.org/)
- [MySQL](https://www.mysql.com/) (or compatible database)

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
   The frontend will be available at `http://localhost:5173`

### Backend Setup

1. From the project root, create and activate a virtual environment:

   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r backend/requirements.txt
   ```

3. Configure environment variables in `.env`:

   ```
   DATABASE_URL=mysql+pymysql://username:password@localhost/database_name
   SECRET_KEY=your_secret_key_here
   ```

4. Run the backend server:
   ```bash
   cd backend
   python main.py
   ```
   The backend API will be available at `http://localhost:8000`

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Employees

- `GET /api/admin/employees` - Get all employees
- `GET /api/admin/employee/{emp_id}` - Get employee details
- `PUT /api/admin/employee/{emp_id}` - Update employee

### Tasks

- `GET /api/tasks/employee/{emp_id}?filter=week|month|year` - Get employee tasks

### Leave Management

- `GET /api/leaves/employee/{emp_id}?filter=week|month|year` - Get employee leaves
- `GET /api/leaves/summary` - Get leave summary

## 🎯 Key Features Explained

### Employee Termination
- **Terminate from Multiple Locations**: 
  - All Employees table (trash icon in actions)
  - Employee Details page (terminate button in header)
  - Admin Dashboard (for specific admin tasks)
- **Confirmation Dialog**: Safety confirmation before termination
- **Support for All Employee Types**: Works for both API employees and newly created employees

### New Employee Management
- **Approval Workflow**: Admin dashboard shows pending new employee approvals
- **Diverse Employee Data**: Each new employee receives:
  - Unique salary (50k-100k range based on emp_id)
  - Random department assignment
  - Performance score (3-10 based on emp_id)
  - Joining date (current date)
  - Generated email (firstname.lastname@nexushr.com)
- **Persistent Storage**: New employees persist across:
  - Page refreshes
  - Logout/login sessions
  - All admin views

### Data Persistence
- **LocalStorage Integration**: Admin settings and new employees stored locally
- **Cross-Session Preservation**: Employee approvals maintained through logout
- **Seamless Fallback**: Employee details load from localStorage if API unavailable

## 🎯 Key Features Explained (Original)

### Time-Based Filtering

Tasks and leaves can be filtered by:

- **Week**: Current 7-day period
- **Month**: Current 30-day period
- **Year**: Current 365-day period

### Employee-Specific Data

Each employee has unique mock data generated based on:

- Employee ID (deterministic seeding for consistency)
- Role-based task titles
- Contextual leave reasons based on leave type

### Performance Scoring

Performance scores are on a scale of 0-10 to standardize metrics across the organization.

## 🔧 Development

### Running Tests

```bash
# Frontend tests
npm run test

# Backend tests
pytest
```

### Build for Production

```bash
# Frontend build
npm run build

# Backend is ready for production once deployed
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
