# 🏢 Company Employee Management System

A comprehensive, enterprise-grade Employee Management System built with FastAPI backend and React frontend, featuring role-based dashboards, task management, leave tracking, performance monitoring, and advanced admin controls for HR management.

**Status**: ✅ Fully Functional | **Version**: 1.0.0

## 🚀 Key Features

### 👨‍💼 Employee Dashboard

- **Overview Tab**:
  - View personal details (name, email, department, role, performance score)
  - Quick stats and KPIs
  - Joining date and employment status
- **Task Management Tab**:
  - Track assigned tasks with real-time status updates
  - Time-based filtering (Week/Month/Year)
  - Task statistics: Total, Completed, Pending, Ongoing
  - Task completion rate visualization with progress bar
  - Interactive charts: Bar chart and Pie chart analytics
  - Sortable task list (by Date or Status)
  - Refresh functionality for latest data
- **Leave Management Tab**:
  - View and track leave records with status breakdown
  - Leave statistics showing Approved, Pending, and Rejected days
  - Leave breakdown by type for analysis:
    - Sick Leave (Medical appointments, Illness)
    - Casual Leave (Personal reasons, Rest/Relaxation)
    - Vacation Leave (Travel, Holiday trips)
    - Paid Time Off (PTO) (Personal time off)
  - Detailed leave records table
  - Leave request submission capability

### 👨‍💼 Manager Dashboard

- **Employee Performance Monitoring**: Real-time performance analytics
- **Task Assignment**: Create and assign tasks to team members
- **Team Overview**: Quick view of all team members and their status
- **Performance Analytics**: Track team productivity and metrics

### 🏛️ Admin Panel

- **Employee Management**:
  - View all employees with comprehensive data (name, email, department, salary, performance)
  - Advanced search and filtering by department, status, performance, salary ranges
  - Bulk operations (Mark Active/Inactive, Bulk Delete)
  - Employee termination with confirmation dialogs
  - CSV export functionality for data analysis
  - Expandable rows showing employee tasks and leave summary
  - Real-time data updates

- **Employee Details View**:
  - Multi-tab interface (Overview, Tasks, Leave)
  - Full employee profile management
  - Performance tracking and updates
  - Salary information
  - Access employee tasks and leave records
  - Employee termination capabilities

- **Admin Dashboard**:
  - System overview with key statistics and KPIs
  - Pending approvals queue (New Employees, Leave Requests, Role Changes)
  - Recent activity feed for auditing
  - Alert management system
  - Role-based access control (RBAC)
  - System health monitoring

- **New Employee Management**:
  - Approve new employee requests from dashboard
  - Automatic assignment of unique data (salary, department, performance)
  - New employees immediately integrated into all views
  - Persistent data across sessions

- **Leave Request Management**:
  - Track and approve/reject employee leave requests
  - View leave balances and history
  - Custom leave reason tracking

- **Performance Management**:
  - Track employee performance scores
  - Performance analytics and trends
  - Performance-based reporting

- **Responsive Design**: Optimized for desktop, tablet, and mobile screens

### 📅 Leave Management System

- **4 Leave Types**:
  - **Sick Leave**: Medical appointments, Illness, Doctor visits
  - **Casual Leave**: Personal reasons, Rest and relaxation
  - **Vacation Leave**: Travel, Holiday trips
  - **Paid Time Off (PTO)**: Personal time off and special occasions
- **Leave Status Tracking**: Approved, Pending, Rejected
- **Contextual Leave Reasons**: Different reason options per leave type
- **Leave Analytics**: Track leave patterns and balances
- **Approval Workflow**: Multi-level leave approval process

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

backend/ # FastAPI Backend Server
│ ├── routes/
│ │ ├── auth.py # Authentication & Login endpoints
│ │ ├── admin.py # Admin panel endpoints
│ │ ├── employee.py # Employee data endpoints
│ │ ├── manager.py # Manager functionality endpoints
│ │ ├── tasks.py # Task management endpoints
│ │ ├── leaves.py # Leave tracking endpoints
│ │ ├── hr.py # HR operations endpoints
│ │ └── user.py # User profile endpoints
│ ├── services/
│ │ └── agent_service.py # AI Agent service integration
│ ├── db/
│ │ └── connection.py # MySQL database connection
│ ├── main.py # FastAPI application entry
│ ├── security.py # JWT & security utilities
│ ├── requirements.txt # Python dependencies
│ ├── .env # Environment configuration
│ └── **init**.py
│
├── frontend/ # React + Vite Frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── Layout/ # App Layout, Sidebar, Navbar
│ │ │ ├── TaskDashboard/ # Task management & analytics
│ │ │ ├── EmployeeLeave/ # Leave management interface
│ │ │ ├── Button/ # Reusable button components
│ │ │ ├── Card/ # Card layout components
│ │ │ ├── Table/ # Data table component
│ │ │ ├── Input/ # Form input components
│ │ │ ├── Select/ # Select dropdown component
│ │ │ ├── Badge/ # Status badge component
│ │ │ ├── Sections/ # Dashboard sections
│ │ │ ├── StatsCard/ # Statistics card component
│ │ │ ├── InsightBox/ # Insight box component
│ │ │ ├── LeaveDashboard/ # Leave dashboard page
│ │ │ ├── PerformanceChart # Performance visualization
│ � Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Python 3.8+](https://www.python.org/)
- [MySQL 8.0+](https://www.mysql.com/)
- [Git](https://git-scm.com/)

### Installation & Setup

#### 1. Clone & Navigate to Project

```bash
git clone <repository-url>
cd Company_Employee_Management_Sytem
```

#### 2. Backend Setup

```bash
# Create Python virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install Python dependencies
cd backend
pip install -r requirements.txt
cd ..
```

#### 3. Database Setup

```bash
# Ensure MySQL is running, then configure .env file:
cp backend/.env.example backend/.env

# Edit backend/.env with your database credentials:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=DBMS_PROJECT
```

#### 4. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

cd ..
```

### Running the Application

#### Option 1: Run All Services Manually

**Terminal 1 - Backend:**

```bash
cd backend
source .venv/bin/activate  # On macOS/Linux
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

**Terminal 3 - MySQL (if not running as service):**

```bash
mysql -u root -p
```

#### Option 2: Use Start Script (if available)

```bash
chmod +x start.sh
./start.sh
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc

### Default Login Credentials

**Admin Account:**

- Email: `admin@nexushr.com`
- Password: `123`

**Test Employee Account:**

- Email: `employee@nexushr.com`
- Password: `123`

## 🛠️ Technology Stack

**Frontend:**

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Client-side routing

**Backend:**

- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **MySQL Connector** - Database driver
- **PyJWT** - JSON Web Token authentication
- **Pydantic** - Data validation
- **BCrypt** - Password hashing
- **SlowAPI** - Rate limiting
- **Python-dotenv** - Environment configuration

**Agents & Automation:**

- **HR Decision Agent** - Automated HR decisions
- **Payroll Agent** - Automated payroll processing
- **Performance Agent** - Performance analytics
- **Task Manager Agent** - Task automation

**Database:**

- **MySQL** - Relational database

## 📋 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Employee

- `GET /api/employee/{emp_id}` - Get employee details
- `GET /api/employee/{emp_id}/tasks` - Get employee tasks
- `GET /api/employee/{emp_id}/leaves` - Get employee leaves
- `POST /api/employee/{emp_id}/leave-request` - Request leave

### Manager

- `GET /api/manager/team` - Get manager's team
- `GET /api/manager/performance` - Team performance

### Admin

- `GET /api/admin/employees` - List all employees
- `POST /api/admin/employee` - Create new employee
- `PUT /api/admin/employee/{emp_id}` - Update employee
- `DELETE /api/admin/employee/{emp_id}` - Delete employee
- `GET /api/admin/dashboard` - Admin dashboard data
- `POST /api/admin/approve-leave/{leave_id}` - Approve leave request

### Tasks

- `GET /api/tasks/employee/{emp_id}` - Get employee tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task

### Leave

- `GET /api/leaves/employee/{emp_id}` - Get employee leaves
- `POST /api/leaves/request` - Request leave
- `PUT /api/leaves/{leave_id}/approve` - Approve leave
- `PUT /api/leaves/{leave_id}/reject` - Reject leave

For complete API documentation, navigate to http://localhost:8000/docs

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - BCrypt for secure password storage
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin request validation
- **Role-Based Access Control** - User roles (Admin, Manager, Employee)
- **Request Validation** - Pydantic data validation on all endpoints

## 📊 Features by User Role

### Employee

- ✅ View personal dashboard
- ✅ Track assigned tasks
- ✅ Submit leave requests
- ✅ View performance metrics
- ✅ Check salary information

### Manager

- ✅ View team dashboard
- ✅ Assign tasks to team members
- ✅ Monitor team performance
- ✅ Approve/reject leave requests
- ✅ Track team metrics

### Admin/HR

- ✅ Full employee management
- ✅ Leave request approval
- ✅ Performance tracking
- ✅ Payroll management
- ✅ System configuration
- ✅ Role management
- ✅ Generate reports
- ✅ Audit logs

## 🧪 Testing

### Manual Testing

1. **Login Test**:
   - Navigate to http://localhost:5173
   - Use test credentials above
   - Verify successful authentication

2. **Task Dashboard Test**:
   - Login as employee
   - Navigate to Employee → Tasks tab
   - Test time filters (Week/Month/Year)
   - Verify charts and stats load correctly

3. **Leave Management Test**:
   - Submit a leave request
   - Login as admin
   - Approve/reject the leave request
   - Verify status updates

See [QUICK_START.md](QUICK_START.md) for detailed testing checklist.

## 📚 Documentation

- [QUICK_START.md](QUICK_START.md) - Quick start guide & testing
- [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md) - Detailed architecture
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation details
- [TASK_DASHBOARD_GUIDE.md](TASK_DASHBOARD_GUIDE.md) - Task dashboard documentation
- [LEAVE_MANAGEMENT_GUIDE.md](LEAVE_MANAGEMENT_GUIDE.md) - Leave system documentation

## 🐛 Troubleshooting

### Backend won't start

- Check Python version: `python3 --version` (should be 3.8+)
- Verify virtual environment is activated
- Check MySQL is running: `mysql -u root -p`
- Review backend/.env file for correct database credentials

### Frontend won't start

- Clear node_modules: `rm -rf node_modules` and `npm install`
- Check Node version: `node --version` (should be v16+)
- Ensure port 5173 is not in use

### Database connection errors

- Verify MySQL service is running
- Check credentials in backend/.env
- Ensure database `DBMS_PROJECT` exists
- Check port 3306 is open

### API errors

- Check http://localhost:8000/docs for available endpoints
- Verify auth token is valid
- Check rate limiting hasn't been triggered

## 📝 Environment Configuration

Create `backend/.env` file with:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=12345678
DB_NAME=DBMS_PROJECT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=http://localhost:5173
```

## 🤝 Contributing

1. Create a new feature branch: `git checkout -b feature/feature-name`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit a pull request

## 📄 License

This project is proprietary and confidential.

## 👥 Support & Contact

For issues, questions, or feature requests, please contact the development team or create an issue in the repository.

---

**Last Updated**: April 19, 2026 | **Version**: 1.0.0te.config.js # Vite configuration
│ ├── tailwind.config.js # Tailwind CSS config
│ └── index.html
│
├── HR_DECISION/ # HR Decision Agent Module
│ ├── agent.py # HR decision-making logic
│ └── **init**.py
│
├── Payroll_Agent/ # Payroll Processing Agent
│ ├── agent.py # Payroll calculation logic
│ └── **init**.py
│
├── Performance_agent/ # Performance Analytics Agent
│ ├── agent.py # Performance tracking logic
│ └── **init**.py
│
├── task_manager/ # Task Management Agent
│ ├── agent.py # Task automation logic
│ └── **init**.py
│
├── QUICK_START.md # Quick start & testing guide
├── ARCHITECTURE_GUIDE.md # Detailed architecture documentation
├── IMPLEMENTATION_SUMMARY.md # Implementation details
├── LEAVE_MANAGEMENT_GUIDE.md # Leave system documentation
├── TASK_DASHBOARD_GUIDE.md # Task dashboard documentation
├── README.md # This file
└── .env.example # Environment template
│ └── requirements.txt
├── README.md
└── .env # Environment variables (not in git)

````

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Python 3.8+](https://www.python.org/)
- [MySQL](https://www.mysql.com/) (or compatible database)

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
````

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
