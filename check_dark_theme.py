import os
import re

files_to_check = [
    "src/components/Layout/AppLayout.jsx",
    "src/components/Layout/Navbar.jsx",
    "src/components/Layout/Sidebar.jsx",
    "src/components/Layout/MainContainer.jsx",
    "src/components/Badge/Badge.jsx",
    "src/components/Button/Button.jsx",
    "src/components/Card/Card.jsx",
    "src/components/Input/Input.jsx",
    "src/components/Select/Select.jsx",
    "src/components/Table/Table.jsx",
    "src/components/StatsCard/StatsCard.jsx",
    "src/components/InsightBox/InsightBox.jsx",
    "src/components/PerformanceChart.jsx",
    "src/components/Sections/WelcomeSection.jsx",
    "src/components/Sections/StatsGrid.jsx",
    "src/components/Sections/ChartSection.jsx",
    "src/components/Sections/TableSection.jsx",
    "src/components/Sections/InsightSection.jsx",
    "src/components/EmployeeLeave/EmployeeLeave.jsx",
    "src/components/LeaveDashboard/LeaveDashboard.jsx",
    "src/components/TaskDashboard/TaskDashboard.jsx",
    "src/components/TaskDashboard/TaskChart.jsx",
    "src/pages/Login.jsx",
    "src/pages/SetPassword.jsx",
    "src/pages/EmployeeDashboard.jsx",
    "src/pages/EmployeeTasks.jsx",
    "src/pages/EmployeePerformance.jsx",
    "src/pages/EmployeeSalary.jsx",
    "src/pages/ManagerDashboard.jsx",
    "src/pages/AdminDashboard.jsx",
    "src/pages/AllEmployees.jsx",
    "src/pages/EmployeeDetails.jsx",
    "src/pages/SystemOverview.jsx",
    "src/pages/AdminSettings.jsx",
    "src/pages/Settings.jsx",
    "src/index.css",
    "tailwind.config.js"
]

patterns = [
    r'bg-white', r'bg-gray-50', r'bg-gray-100', r'bg-gray-200',
    r'bg-slate-50', r'bg-slate-100', r'bg-slate-200',
    r'bg-zinc-50', r'bg-zinc-100', r'bg-neutral-50', r'bg-neutral-100',
    r'hover:bg-white', r'hover:bg-gray-50', r'hover:bg-gray-100',
    r'hover:bg-gray-200', r'hover:bg-slate-50', r'hover:bg-slate-100',
    r'text-gray-900', r'text-gray-800', r'text-gray-700', r'text-black',
    r'text-slate-900', r'text-slate-800', r'text-slate-700',
    r'text-zinc-900', r'text-zinc-800', r'text-neutral-900', r'text-neutral-800',
    r'text-gray-600', r'text-gray-500', r'text-slate-600', r'text-slate-500',
    r'border-gray-200', r'border-gray-300', r'border-gray-100',
    r'border-slate-200', r'border-slate-300', r'divide-gray-200', r'divide-gray-100',
    r'ring-gray-200', r'focus:ring-gray-300', r'focus:border-gray-400',
    r'shadow-sm', r'shadow-md', r'shadow-lg'
]

for file in files_to_check:
    filepath = os.path.join('/Users/riishabhjain/Desktop/DBMS_PROJECT/frontend', file)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            found = False
            for p in patterns:
                # Add word boundaries so bg-white doesn't match bg-white/10
                if re.search(r'\b' + p + r'(?!\/)', content):
                    print(f"FOUND in {file}: {p}")
                    found = True
            if not found:
                 pass
                 #print(f"CLEAN: {file}")
    else:
        print(f"MISSING: {file}")

