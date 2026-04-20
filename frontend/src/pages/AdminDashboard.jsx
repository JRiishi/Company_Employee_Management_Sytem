// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Activity,
  Settings,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Trash2,
  Eye,
  MoreVertical,
  Loader,
  Clock,
  CheckSquare,
  Home,
  Database,
  Server,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import Card from "../components/Card/Card";
import api from "../services/api";

const AdminDashboard = () => {
  const { data, loading, error, createUser } = useAdminData();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showFireConfirm, setShowFireConfirm] = useState(false);
  const [employeeToFire, setEmployeeToFire] = useState(null);
  const [firingLoading, setFiringLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "employee",
    department: "",
  });
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showCreateDeptModal, setShowCreateDeptModal] = useState(false);
  const [showAssignRolesModal, setShowAssignRolesModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [newRole, setNewRole] = useState("");
  const [selectedRoleEmployee, setSelectedRoleEmployee] = useState(null);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [modalEmployeeType, setModalEmployeeType] = useState("all");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Helper function to generate random names
  const generateRandomName = () => {
    const firstNames = ["James", "Sarah", "Michael", "Emma", "David", "Sophia", "Robert", "Isabella", "John", "Olivia", "William", "Ava", "Benjamin", "Mia", "Lucas", "Charlotte", "Alexander", "Amelia", "Daniel", "Harper"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzales", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  };

  // Initialize approvals with random names for New Employee
  const [approvals, setApprovals] = useState([
    { id: 1, type: "Leave Request", employee: "John Doe", date: "2 hours ago", status: "pending" },
    { id: 2, type: "Role Change", employee: "Sarah Smith", date: "5 hours ago", status: "pending" },
    { id: 3, type: "New Employee", employee: generateRandomName(), date: "1 day ago", status: "pending" },
    { id: 4, type: "Leave Request", employee: "Alex Kumar", date: "1 day ago", status: "pending" },
  ]);
  const [recentActivities, setRecentActivities] = useState([
    {
      action: "Employee Onboarded",
      details: "John Doe joined Sales",
      time: "2 hours ago",
      icon: UserPlus,
    },
    {
      action: "Task Completed",
      details: "API Integration completed by Sarah",
      time: "4 hours ago",
      icon: CheckSquare,
    },
    {
      action: "Leave Approved",
      details: "Vacation leave approved for Mike",
      time: "1 day ago",
      icon: Clock,
    },
    {
      action: "Performance Review",
      details: "Q1 review submitted for 5 employees",
      time: "1 day ago",
      icon: Activity,
    },
  ]);

  // Fetch all employees with details
  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchTasks();

    // Regenerate approval names on each page load
    setApprovals(prev => prev.map(app =>
      app.type === "New Employee"
        ? { ...app, employee: generateRandomName() }
        : app
    ));
  }, []);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await api.get("/admin/employees");
      let empList = response.data || [];

      // Load added employees from localStorage
      const addedEmployees = localStorage.getItem("addedEmployees");
      if (addedEmployees) {
        const added = JSON.parse(addedEmployees);
        empList = [...empList, ...added];
      }

      if (response.success) {
        setEmployees(empList);
        setFilteredEmployees(empList);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await api.get("/leaves/summary?filter=month");
      if (response.success) {
        setLeaves(response.data?.leaves || []);
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      let allTasks = [];
      for (const emp of employees) {
        const res = await api.get(`/tasks/employee/${emp.emp_id}?filter=year`);
        if (res.data?.tasks) {
          allTasks = allTasks.concat(
            res.data.tasks.map((t) => ({
              ...t,
              emp_id: emp.emp_id,
              emp_name: emp.name,
            }))
          );
        }
      }
      setTasks(allTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  // Fetch employee details
  const viewEmployeeDetails = async (empId) => {
    try {
      const response = await api.get(`/admin/employee/${empId}`);
      if (response.success) {
        setSelectedEmployee(response.data);
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
    }
  };

  // Fire employee
  const handleFireEmployee = async () => {
    if (!employeeToFire) return;

    try {
      setFiringLoading(true);

      // Check if this is a new employee (in localStorage)
      const addedEmployees = localStorage.getItem("addedEmployees");
      const addedList = addedEmployees ? JSON.parse(addedEmployees) : [];
      const isNewEmployee = addedList.some((e) => e.emp_id === employeeToFire.emp_id);

      if (isNewEmployee) {
        // Remove from localStorage
        const updated = addedList.filter((e) => e.emp_id !== employeeToFire.emp_id);
        localStorage.setItem("addedEmployees", JSON.stringify(updated));

        setSubmitStatus({
          type: "success",
          message: `${employeeToFire.name} has been terminated.`,
        });
      } else {
        // Call API for regular employees
        const response = await api.post("/admin/fire-employee", {
          emp_id: employeeToFire.emp_id,
          reason: "Terminated by admin",
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to terminate employee");
        }

        setSubmitStatus({
          type: "success",
          message: `${employeeToFire.name} has been terminated.`,
        });
      }

      setShowFireConfirm(false);
      setEmployeeToFire(null);
      fetchEmployees();
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.message || "Error terminating employee",
      });
    } finally {
      setFiringLoading(false);
    }
  };

  // Create new user
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    if (!form.name || !form.email || !form.department) {
      setSubmitStatus({ type: "error", message: "All fields are required." });
      setIsSubmitting(false);
      return;
    }

    const result = await createUser(form);
    if (result.success) {
      setSubmitStatus({
        type: "success",
        message: "User created successfully!",
      });
      setForm({ name: "", email: "", role: "employee", department: "" });
      fetchEmployees();
    } else {
      setSubmitStatus({ type: "error", message: result.message });
    }
    setIsSubmitting(false);
  };

  const managers = employees
    .filter((e) => e.role === "manager" || e.department === "Management")
    .slice(0, 5);

  const adminAccessEmployees = [
    ...employees.filter((e) => e.role === "admin" || e.role === "manager"),
    {
      emp_id: 999,
      name: "Admin User",
      email: "admin@nexushr.com",
      department: "Administration",
      role: "admin",
      status: "active",
      performance_score: 9,
    },
  ];

  const handleApproval = (id) => {
    const approval = approvals.find(app => app.id === id);
    if (!approval) return;

    // Update approvals list
    setApprovals(approvals.map(app =>
      app.id === id ? { ...app, status: "approved" } : app
    ));

    // Add to recent activity
    const newActivity = {
      action: `${approval.type} Approved`,
      details: `${approval.type} approved for ${approval.employee}`,
      time: "Just now",
      icon: CheckCircle,
    };
    setRecentActivities([newActivity, ...recentActivities.slice(0, 3)]);

    // If New Employee is approved, add them to employees list and save to localStorage
    if (approval.type === "New Employee") {
      const newEmpId = Math.max(...employees.map((e) => e.emp_id || 0), 999) + 1;

      // Use emp_id as seed for deterministic but diverse data
      const seed1 = (newEmpId * 12345) % 100;
      const seed2 = (newEmpId * 54321) % 100;
      const seed3 = (newEmpId * 98765) % 100;

      const departments = ["Engineering", "Sales", "HR", "Marketing", "Operations"];
      const department = departments[(seed1) % departments.length];
      const performance = 3 + ((seed2) % 8);
      const salary = 50000 + ((seed3) * 600);

      const newEmployee = {
        emp_id: newEmpId,
        name: approval.employee,
        email: `${approval.employee.toLowerCase().replace(" ", ".")}@nexushr.com`,
        department: department,
        role: "employee",
        status: "active",
        performance_score: performance,
        salary: salary,
        joining_date: new Date().toISOString().split('T')[0],
      };

      const updatedEmployees = [...employees, newEmployee];
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);

      // Save to localStorage
      const addedEmployees = localStorage.getItem("addedEmployees");
      const currentAdded = addedEmployees ? JSON.parse(addedEmployees) : [];
      currentAdded.push(newEmployee);
      localStorage.setItem("addedEmployees", JSON.stringify(currentAdded));
    }

    // Update leaves/approvals data if it's a leave request
    if (approval.type === "Leave Request") {
      setLeaves(leaves.map(l =>
        l.employee_name === approval.employee ? { ...l, status: "Approved" } : l
      ));
    }

    setSubmitStatus({ type: "success", message: `${approval.employee}'s ${approval.type.toLowerCase()} accepted!` });
    setTimeout(() => {
      setApprovals(approvals.filter(app => app.id !== id));
      setSubmitStatus({ type: "", message: "" });
    }, 1500);
  };

  const handleReject = (id) => {
    const approval = approvals.find(app => app.id === id);
    if (!approval) return;

    // Update approvals list
    setApprovals(approvals.map(app =>
      app.id === id ? { ...app, status: "rejected" } : app
    ));

    // Add to recent activity
    const newActivity = {
      action: `${approval.type} Rejected`,
      details: `${approval.type} rejected for ${approval.employee}`,
      time: "Just now",
      icon: AlertCircle,
    };
    setRecentActivities([newActivity, ...recentActivities.slice(0, 3)]);

    // Update leaves/approvals data if it's a leave request
    if (approval.type === "Leave Request") {
      setLeaves(leaves.map(l =>
        l.employee_name === approval.employee ? { ...l, status: "Rejected" } : l
      ));
    }

    setSubmitStatus({ type: "success", message: `${approval.employee}'s ${approval.type.toLowerCase()} rejected!` });
    setTimeout(() => {
      setApprovals(approvals.filter(app => app.id !== id));
      setSubmitStatus({ type: "", message: "" });
    }, 1500);
  };

  const lowPerformanceEmployees = employees
    .filter((e) => e.performance_score < 5)
    .slice(0, 3);
  const overdueTasks = tasks.filter((t) => t.status === "pending").slice(0, 3);

  // Enhanced sample alerts data
  const sampleAlerts = [
    { type: "overdue", title: "3 Overdue Tasks", detail: "Tasks pending for more than 7 days", severity: "high" },
    { type: "performance", title: `${lowPerformanceEmployees.length} Low Performance`, detail: "Employees with score below 5", severity: "medium" },
    { type: "attendance", title: "2 Unauthorized Absences", detail: "Employees missing without notification", severity: "high" },
  ];

  const pendingLeaves = leaves.filter((l) => l.status === "Pending").slice(0, 2);

  if (loading)
    return (
      <div className="p-8 text-center text-text-secondary font-inter">
        Loading admin data...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-600 font-inter">{error}</div>
    );

  const activeEmployees = employees.filter((e) => e.status === "active");
  const inactiveEmployees = employees.filter((e) => e.status === "inactive");

  let modalEmployees = [];
  let modalTitle = "";
  if (modalEmployeeType === "all") {
    modalEmployees = employees;
    modalTitle = `All Employees (${employees.length})`;
  } else if (modalEmployeeType === "active") {
    modalEmployees = activeEmployees;
    modalTitle = `Active Employees (${activeEmployees.length})`;
  } else if (modalEmployeeType === "inactive") {
    modalEmployees = inactiveEmployees;
    modalTitle = `Inactive Employees (${inactiveEmployees.length})`;
  } else if (modalEmployeeType === "admin") {
    modalEmployees = adminAccessEmployees;
    modalTitle = `Admin Access (${adminAccessEmployees.length})`;
  }

  return (
    <div className="w-full flex flex-col gap-6 text-text-primary">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pt-6 px-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                System Administration
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                Manage employees, view details, and handle HR decisions
              </p>
            </div>
          </div>

          {/* Admin Header Section */}
          <Card className="border-border-default bg-bg-surface">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div>
                <p className="text-xs md:text-sm text-text-secondary mb-1">
                  System Administrator
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3 md:mb-4">
                  Welcome back, Admin
                </h2>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-xs md:text-sm">
                  <div>
                    <p className="text-text-secondary">Last Login</p>
                    <p className="text-text-primary font-medium">Today at 09:45 AM</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Active Sessions</p>
                    <p className="text-text-primary font-medium">1 session</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-green-100 border border-green-300 rounded-lg whitespace-nowrap">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm text-green-700 font-semibold">
                  System Healthy
                </span>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <Card
              onClick={() => {
                setModalEmployeeType("all");
                setShowEmployeesModal(true);
              }}
              className="border-border-default bg-bg-surface hover:border-blue-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Users className="text-blue-600" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-text-secondary">
                    Total Employees
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                    {employees.length}
                  </h3>
                </div>
              </div>
            </Card>

            <Card
              onClick={() => {
                setModalEmployeeType("active");
                setShowEmployeesModal(true);
              }}
              className="border-border-default bg-bg-surface hover:border-green-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-green-100 rounded-lg flex-shrink-0">
                  <Activity className="text-green-600" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-text-secondary">
                    Active Employees
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                    {activeEmployees.length}
                  </h3>
                </div>
              </div>
            </Card>

            <Card
              onClick={() => {
                setModalEmployeeType("inactive");
                setShowEmployeesModal(true);
              }}
              className="border-border-default bg-bg-surface hover:border-yellow-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                  <AlertCircle className="text-yellow-600" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-text-secondary">Inactive</p>
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                    {inactiveEmployees.length}
                  </h3>
                </div>
              </div>
            </Card>

            <Card
              onClick={() => {
                setModalEmployeeType("admin");
                setShowEmployeesModal(true);
              }}
              className="border-border-default bg-bg-surface hover:border-purple-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-purple-100 rounded-lg flex-shrink-0">
                  <Shield className="text-purple-600" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-text-secondary">Admin Access</p>
                  <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                    {adminAccessEmployees.length}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg md:text-xl font-bold text-text-primary mb-3 md:mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: UserPlus, label: "Add Employee", color: "blue", action: () => setShowAddEmployeeModal(true) },
            { icon: Shield, label: "Add Manager", color: "purple", action: () => setShowAddManagerModal(true) },
            { icon: Home, label: "Create Department", color: "green", action: () => setShowCreateDeptModal(true) },
            { icon: Users, label: "Assign Roles", color: "yellow", action: () => setShowAssignRolesModal(true) },
          ].map((action, idx) => {
            const Icon = action.icon;
            const colorMap = {
              blue: "bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700",
              purple:
                "bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700",
              green:
                "bg-green-100 hover:bg-green-200 border-green-300 text-green-700",
              yellow:
                "bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-700",
            };
            return (
              <motion.button
                key={idx}
                whileHover={{ translateY: -2 }}
                onClick={action.action}
                className={`p-3 md:p-4 rounded-lg border transition-colors ${
                  colorMap[action.color]
                }`}
              >
                <Icon size={18} className="mb-1 md:mb-2" />
                <p className="text-xs md:text-sm font-semibold">
                  {action.label}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Critical Alerts & Manager Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Critical Alerts */}
        <Card className="border-border-default bg-bg-surface">
          <h3 className="text-base md:text-lg font-bold text-text-primary mb-3 md:mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
            <span>Critical Alerts</span>
          </h3>
          <div className="space-y-3">
            {sampleAlerts.map((alert, idx) => (
              <div key={idx} className="border-b border-border-default pb-3 last:border-b-0 last:pb-0">
                <button
                  onClick={() => {
                    setSelectedAlert(alert);
                    setShowAlertModal(true);
                  }}
                  className="w-full text-left hover:opacity-80 transition-opacity"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary hover:text-blue-600">
                        {alert.title}
                      </p>
                      <p className="text-text-secondary text-xs mt-1">{alert.detail}</p>
                    </div>
                    <span className={`inline-block flex-shrink-0 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap mt-2 sm:mt-0 ${alert.severity === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {alert.severity === "high" ? "High" : "Medium"}
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Manager Overview */}
        <Card className="border-border-default bg-bg-surface">
          <h3 className="text-base md:text-lg font-bold text-text-primary mb-3 md:mb-4">
            Manager Overview
          </h3>
          <div className="space-y-2">
            {managers.length > 0 ? (
              managers.map((mgr, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm p-2 bg-bg-elevated rounded border border-border-default"
                >
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium">{mgr.name}</p>
                    <p className="text-text-secondary text-xs">{mgr.department}</p>
                  </div>
                  <div className="text-right text-xs md:text-sm">
                    <p className="text-text-primary font-semibold">1 team</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-sm">No managers assigned</p>
            )}
          </div>
        </Card>
      </div>

      {/* Pending Approvals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Pending Approvals */}
        <Card className="border-border-default bg-bg-surface">
          <h3 className="text-base md:text-lg font-bold text-text-primary mb-3 md:mb-4 flex items-center gap-2">
            <Clock size={18} className="text-yellow-600" />
            Pending Approvals
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {approvals.length > 0 ? (
              approvals.map((approval) => (
                <div
                  key={approval.id}
                  className="p-2 md:p-3 bg-bg-elevated rounded border border-border-default text-sm"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-text-primary font-medium">{approval.type}</p>
                      <p className="text-text-secondary text-xs">
                        {approval.employee}
                      </p>
                    </div>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {approval.date}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproval(approval.id)}
                      className="flex-1 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-semibold transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="flex-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-secondary text-sm">No pending approvals</p>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border-default bg-bg-surface">
          <h3 className="text-base md:text-lg font-bold text-text-primary mb-3 md:mb-4">
            Recent Activity
          </h3>
          <div className="space-y-2 md:space-y-3 max-h-48 overflow-y-auto">
            {recentActivities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div
                  key={idx}
                  className="flex gap-2 md:gap-3 text-sm p-2 bg-bg-elevated rounded border border-border-default"
                >
                  <Icon size={16} className="text-text-secondary flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium text-xs md:text-sm">
                      {activity.action}
                    </p>
                    <p className="text-text-secondary text-xs">{activity.details}</p>
                    <p className="text-text-muted text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="border-border-default bg-bg-surface">
        <h3 className="text-lg md:text-xl font-bold text-text-primary mb-3 md:mb-4">
          System Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {[
            { label: "Server", status: "Online", icon: Server },
            { label: "Database", status: "Connected", icon: Database },
            { label: "Last Backup", status: "Today 02:00 AM", icon: Clock },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3 md:p-4 bg-bg-elevated rounded border border-border-default flex items-start gap-2 md:gap-3"
              >
                <Icon size={20} className="text-text-secondary flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <p className="text-text-secondary">{item.label}</p>
                  <p className="text-text-primary font-semibold text-sm">
                    {item.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Status Messages */}
      {submitStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-3 text-sm md:text-base ${
            submitStatus.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {submitStatus.type === "success" ? (
            <CheckCircle size={20} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0" />
          )}
          <span>{submitStatus.message}</span>
        </motion.div>
      )}

      {/* Alert Details Modal */}
      {showAlertModal && selectedAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAlertModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-surface rounded-xl border border-border-default p-6 max-w-3xl w-full max-h-[80vh] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                {selectedAlert.title}
              </h3>
              <button
                onClick={() => setShowAlertModal(false)}
                className="text-text-muted hover:text-text-secondary"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-default bg-bg-elevated">
                    {selectedAlert.type === "overdue" && (
                      <>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Task</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Assigned To</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Due Date</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Days Overdue</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Priority</th>
                      </>
                    )}
                    {selectedAlert.type === "performance" && (
                      <>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Employee</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Department</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Performance Score</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Status</th>
                      </>
                    )}
                    {selectedAlert.type === "attendance" && (
                      <>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Employee</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Date</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-text-primary font-semibold">Reason</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectedAlert.type === "overdue" && (
                    <>
                      <tr className="border-b border-border-default hover:bg-bg-elevated">
                        <td className="py-3 px-4 text-text-primary font-medium">API Integration with Stripe</td>
                        <td className="py-3 px-4 text-text-secondary">David Chen</td>
                        <td className="py-3 px-4 text-text-secondary">2024-03-15</td>
                        <td className="py-3 px-4 text-red-600 font-semibold">12 days</td>
                        <td className="py-3 px-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">High</span></td>
                      </tr>
                      <tr className="border-b border-border-default hover:bg-bg-elevated">
                        <td className="py-3 px-4 text-text-primary font-medium">Database Optimization</td>
                        <td className="py-3 px-4 text-text-secondary">Lisa Wong</td>
                        <td className="py-3 px-4 text-text-secondary">2024-03-20</td>
                        <td className="py-3 px-4 text-red-600 font-semibold">7 days</td>
                        <td className="py-3 px-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">Medium</span></td>
                      </tr>
                      <tr className="border-b border-border-default hover:bg-bg-elevated">
                        <td className="py-3 px-4 text-text-primary font-medium">Security Audit</td>
                        <td className="py-3 px-4 text-text-secondary">Mark Johnson</td>
                        <td className="py-3 px-4 text-text-secondary">2024-03-18</td>
                        <td className="py-3 px-4 text-red-600 font-semibold">9 days</td>
                        <td className="py-3 px-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">High</span></td>
                      </tr>
                    </>
                  )}
                  {selectedAlert.type === "performance" && lowPerformanceEmployees.map((emp, idx) => (
                    <tr key={idx} className="border-b border-border-default hover:bg-bg-elevated">
                      <td className="py-3 px-4 text-text-primary font-medium">{emp.name}</td>
                      <td className="py-3 px-4 text-text-secondary">{employees.find(e => e.emp_id === emp.emp_id)?.department || "N/A"}</td>
                      <td className="py-3 px-4 text-red-600 font-semibold">{emp.performance_score}/10</td>
                      <td className="py-3 px-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">At Risk</span></td>
                    </tr>
                  ))}
                  {selectedAlert.type === "attendance" && (
                    <>
                      <tr className="border-b border-border-default hover:bg-bg-elevated">
                        <td className="py-3 px-4 text-text-primary font-medium">Emma Wilson</td>
                        <td className="py-3 px-4 text-text-secondary">2024-04-10</td>
                        <td className="py-3 px-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Absent</span></td>
                        <td className="py-3 px-4 text-text-secondary">No notification</td>
                      </tr>
                      <tr className="border-b border-border-default hover:bg-bg-elevated">
                        <td className="py-3 px-4 text-text-primary font-medium">James Martinez</td>
                        <td className="py-3 px-4 text-text-secondary">2024-04-09</td>
                        <td className="py-3 px-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Absent</span></td>
                        <td className="py-3 px-4 text-text-secondary">No notification</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowAlertModal(false)}
              className="mt-4 px-4 py-2 bg-bg-elevated hover:bg-gray-300 text-text-primary rounded-lg transition-colors font-semibold text-sm w-full"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
      {showEmployeesModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEmployeesModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-surface rounded-xl border border-border-default p-6 max-w-5xl w-full max-h-[80vh] flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-text-primary">
                {modalTitle}
              </h3>
              <button
                onClick={() => setShowEmployeesModal(false)}
                className="text-text-muted hover:text-text-secondary"
              >
                <X size={24} />
              </button>
            </div>

            {modalEmployees.length === 0 ? (
              <p className="text-center text-text-muted py-8">No employees found</p>
            ) : (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-default bg-bg-elevated">
                      <th className="text-left py-3 px-4 text-text-primary font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-text-primary font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-text-primary font-semibold">Department</th>
                      <th className="text-left py-3 px-4 text-text-primary font-semibold">Role</th>
                      <th className="text-left py-3 px-4 text-text-primary font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalEmployees.map((emp, idx) => (
                      <tr key={idx} className="border-b border-border-default hover:bg-bg-elevated transition-colors cursor-pointer" onClick={() => navigate(`/admin/employee/${emp.emp_id}`)}>
                        <td className="py-3 px-4 text-text-primary font-medium">{emp.name}</td>
                        <td className="py-3 px-4 text-text-secondary">{emp.email || "N/A"}</td>
                        <td className="py-3 px-4 text-text-secondary">{emp.department || "N/A"}</td>
                        <td className="py-3 px-4 text-text-secondary">{emp.role || "Employee"}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            emp.status === "active"
                              ? "bg-green-100 text-green-700"
                              : emp.status === "inactive"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {emp.status || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              onClick={() => setShowEmployeesModal(false)}
              className="mt-4 px-4 py-2 bg-bg-elevated hover:bg-gray-300 text-text-primary rounded-lg transition-colors font-semibold text-sm w-full"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
      {showAddEmployeeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddEmployeeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-surface rounded-xl border border-border-default p-6 max-w-md w-full space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <h3 className="text-lg md:text-xl font-bold text-text-primary">
              Add New Employee
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Employee Name"
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <select className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-blue-500">
                <option>Select Department</option>
                <option>Engineering</option>
                <option>Sales</option>
                <option>HR</option>
                <option>Marketing</option>
              </select>
              <input
                type="text"
                placeholder="Position"
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="flex-1 px-4 py-2 bg-bg-elevated hover:bg-gray-300 text-text-primary rounded-lg transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSubmitStatus({ type: "success", message: "Employee added successfully!" });
                  setShowAddEmployeeModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold text-sm"
              >
                Add Employee
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Manager Modal */}
      {showAddManagerModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddManagerModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-surface rounded-xl border border-border-default p-6 max-w-md w-full space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <h3 className="text-lg md:text-xl font-bold text-text-primary">
              Add New Manager
            </h3>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-purple-500">
                <option>Select Employee to Promote</option>
                {employees.map((emp, idx) => (
                  <option key={idx}>{emp.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Team Name"
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                placeholder="Team Size"
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddManagerModal(false)}
                className="flex-1 px-4 py-2 bg-bg-elevated hover:bg-gray-300 text-text-primary rounded-lg transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSubmitStatus({ type: "success", message: "Manager added successfully!" });
                  setShowAddManagerModal(false);
                }}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold text-sm"
              >
                Add Manager
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Create Department Modal */}
      {showCreateDeptModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateDeptModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-surface rounded-xl border border-border-default p-6 max-w-md w-full space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <h3 className="text-lg md:text-xl font-bold text-text-primary">
              Create New Department
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Department Name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Department Head"
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <textarea
                placeholder="Description"
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-green-500"
                rows="3"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateDeptModal(false)}
                className="flex-1 px-4 py-2 bg-bg-elevated hover:bg-gray-300 text-text-primary rounded-lg transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSubmitStatus({ type: "success", message: "Department created successfully!" });
                  setShowCreateDeptModal(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold text-sm"
              >
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Assign Roles Modal */}
      {showAssignRolesModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAssignRolesModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-surface rounded-xl border border-border-default p-6 max-w-md w-full space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <h3 className="text-lg md:text-xl font-bold text-text-primary">
              Assign Roles
            </h3>
            <div className="space-y-3">
              <select
                value={selectedRoleEmployee?.emp_id || ""}
                onChange={(e) => {
                  const emp = employees.find(e => e.emp_id === parseInt(e.target.value));
                  setSelectedRoleEmployee(emp);
                }}
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-yellow-500"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.emp_id} value={emp.emp_id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-border-strong rounded-lg text-sm focus:outline-none focus:border-yellow-500"
              >
                <option value="">Select New Role</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignRolesModal(false)}
                className="flex-1 px-4 py-2 bg-bg-elevated hover:bg-gray-300 text-text-primary rounded-lg transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedRoleEmployee && newRole) {
                    setSubmitStatus({ type: "success", message: `Role assigned to ${selectedRoleEmployee.name}!` });
                    setShowAssignRolesModal(false);
                    setNewRole("");
                    setSelectedRoleEmployee(null);
                  }
                }}
                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-semibold text-sm"
              >
                Assign
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Fire Confirmation Modal */}
      {showFireConfirm && employeeToFire && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFireConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-surface rounded-xl border border-border-default p-6 max-w-md w-full space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            <h3 className="text-lg md:text-xl font-bold text-text-primary flex items-center space-x-2">
              <AlertCircle size={24} className="text-red-600" />
              <span>Confirm Termination</span>
            </h3>
            <p className="text-text-secondary text-sm md:text-base">
              Are you sure you want to terminate{" "}
              <strong>{employeeToFire.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFireConfirm(false);
                  setEmployeeToFire(null);
                }}
                className="flex-1 px-4 py-2 bg-bg-elevated hover:bg-gray-300 text-text-primary rounded-lg transition-colors font-semibold text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleFireEmployee}
                disabled={firingLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-700/50 text-white rounded-lg transition-colors font-semibold text-sm md:text-base flex items-center justify-center gap-2"
              >
                {firingLoading ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  <Trash2 size={18} />
                )}
                {firingLoading ? "Terminating..." : "Terminate"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
