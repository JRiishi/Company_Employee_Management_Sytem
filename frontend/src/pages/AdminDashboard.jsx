import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useAdminData } from "../hooks/useAdminData";
import Card from "../components/Card/Card";
import api from "../services/api";

const AdminDashboard = () => {
  const { data, loading, error, createUser } = useAdminData();
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
  const [currentView, setCurrentView] = useState("dashboard");
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showCreateDeptModal, setShowCreateDeptModal] = useState(false);
  const [showAssignRolesModal, setShowAssignRolesModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [newRole, setNewRole] = useState("");
  const [selectedRoleEmployee, setSelectedRoleEmployee] = useState(null);

  // Fetch all employees with details
  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchTasks();
  }, []);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await api.get("/admin/employees");
      if (response.success) {
        setEmployees(response.data || []);
        setFilteredEmployees(response.data || []);
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
      const response = await api.post("/admin/fire-employee", {
        emp_id: employeeToFire.emp_id,
        reason: "Terminated by admin",
      });

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: `${employeeToFire.name} has been terminated.`,
        });
        setShowFireConfirm(false);
        setEmployeeToFire(null);
        fetchEmployees();
      } else {
        setSubmitStatus({
          type: "error",
          message: response.message || "Failed to terminate employee",
        });
      }
    } catch (err) {
      setSubmitStatus({ type: "error", message: "Error terminating employee" });
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

  const adminAccessEmployees = employees.filter((e) => e.role === "admin" || e.role === "manager");

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

  // Enhanced sample pending approvals
  const samplePendingApprovals = [
    { type: "Leave Request", employee: "John Doe", date: "2 hours ago", status: "Awaiting approval" },
    { type: "Role Change", employee: "Sarah Smith", date: "5 hours ago", status: "Awaiting approval" },
    { type: "New Employee", employee: "Mike Johnson", date: "1 day ago", status: "Awaiting approval" },
    { type: "Leave Request", employee: "Alex Kumar", date: "1 day ago", status: "Awaiting approval" },
  ];

  const pendingLeaves = leaves.filter((l) => l.status === "Pending").slice(0, 2);

  const recentActivities = [
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
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600 font-inter">
        Loading admin data...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-600 font-inter">{error}</div>
    );

  // Determine which employees to display based on current view
  let viewContent = null;
  let viewTitle = "";
  const activeEmployees = employees.filter((e) => e.status === "active");
  const inactiveEmployees = employees.filter((e) => e.status === "inactive");

  if (currentView !== "dashboard") {
    let displayEmployees = [];
    if (currentView === "allEmployees") {
      displayEmployees = employees;
      viewTitle = `All Employees (${employees.length})`;
    } else if (currentView === "activeEmployees") {
      displayEmployees = activeEmployees;
      viewTitle = `Active Employees (${activeEmployees.length})`;
    } else if (currentView === "inactiveEmployees") {
      displayEmployees = inactiveEmployees;
      viewTitle = `Inactive Employees (${inactiveEmployees.length})`;
    } else if (currentView === "adminAccess") {
      displayEmployees = adminAccessEmployees;
      viewTitle = `Admin Access Employees (${adminAccessEmployees.length})`;
    }

    viewContent = (
      <div>
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mb-4 text-blue-600 hover:text-blue-700 font-semibold text-sm"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {viewTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayEmployees.map((emp, idx) => (
            <Card key={idx} className="border-gray-200 bg-white">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {emp.name}
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Email:</strong> {emp.email || "N/A"}</p>
                <p><strong>Department:</strong> {emp.department || "N/A"}</p>
                <p><strong>Role:</strong> {emp.role || "Employee"}</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${emp.status === "active" ? "text-green-600" : "text-yellow-600"}`}>{emp.status}</span></p>
                {emp.performance_score !== undefined && <p><strong>Performance:</strong> {emp.performance_score}/10</p>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 font-inter max-w-7xl mx-auto space-y-6 md:space-y-8 text-gray-900">
      {viewContent ? (
        viewContent
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                System Administration
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Manage employees, view details, and handle HR decisions
              </p>
            </div>
          </div>

          {/* Admin Header Section */}
          <Card className="border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div>
                <p className="text-xs md:text-sm text-gray-600 mb-1">
                  System Administrator
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Welcome back, Admin
                </h2>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-xs md:text-sm">
                  <div>
                    <p className="text-gray-600">Last Login</p>
                    <p className="text-gray-900 font-medium">Today at 09:45 AM</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Active Sessions</p>
                    <p className="text-gray-900 font-medium">1 session</p>
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
              onClick={() => setCurrentView("allEmployees")}
              className="border-gray-200 bg-white hover:border-blue-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Users className="text-blue-600" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600">
                    Total Employees
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {employees.length}
                  </h3>
                </div>
              </div>
            </Card>

            <Card
              onClick={() => setCurrentView("activeEmployees")}
              className="border-gray-200 bg-white hover:border-green-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-green-100 rounded-lg flex-shrink-0">
                  <Activity className="text-green-600" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600">
                    Active Employees
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {activeEmployees.length}
                  </h3>
                </div>
              </div>
            </Card>

            <Card
              onClick={() => setCurrentView("inactiveEmployees")}
              className="border-gray-200 bg-white hover:border-yellow-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                  <AlertCircle className="text-yellow-600" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600">Inactive</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {inactiveEmployees.length}
                  </h3>
                </div>
              </div>
            </Card>

            <Card
              onClick={() => setCurrentView("adminAccess")}
              className="border-gray-200 bg-white hover:border-purple-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2 md:p-3 bg-purple-100 rounded-lg flex-shrink-0">
                  <Shield className="text-purple-600" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-600">Admin Access</p>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {adminAccessEmployees.length}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
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
        <Card className="border-gray-200 bg-white">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            Critical Alerts
          </h3>
          <div className="space-y-3">
            {sampleAlerts.map((alert, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm font-semibold text-gray-900">
                  {alert.title}
                </p>
                <p className="text-gray-600 text-xs mt-1">{alert.detail}</p>
                <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded ${alert.severity === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {alert.severity === "high" ? "High" : "Medium"} Priority
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Manager Overview */}
        <Card className="border-gray-200 bg-white">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
            Manager Overview
          </h3>
          <div className="space-y-2">
            {managers.length > 0 ? (
              managers.map((mgr, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="min-w-0">
                    <p className="text-gray-900 font-medium">{mgr.name}</p>
                    <p className="text-gray-600 text-xs">{mgr.department}</p>
                  </div>
                  <div className="text-right text-xs md:text-sm">
                    <p className="text-gray-900 font-semibold">1 team</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm">No managers assigned</p>
            )}
          </div>
        </Card>
      </div>

      {/* Pending Approvals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Pending Approvals */}
        <Card className="border-gray-200 bg-white">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <Clock size={18} className="text-yellow-600" />
            Pending Approvals
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {samplePendingApprovals.length > 0 ? (
              samplePendingApprovals.map((approval, idx) => (
                <div
                  key={idx}
                  className="p-2 md:p-3 bg-gray-50 rounded border border-gray-200 text-sm"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-gray-900 font-medium">{approval.type}</p>
                      <p className="text-gray-600 text-xs">
                        {approval.employee}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {approval.date}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">{approval.status}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm">No pending approvals</p>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="border-gray-200 bg-white">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
            Recent Activity
          </h3>
          <div className="space-y-2 md:space-y-3 max-h-48 overflow-y-auto">
            {recentActivities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div
                  key={idx}
                  className="flex gap-2 md:gap-3 text-sm p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <Icon size={16} className="text-gray-700 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-gray-900 font-medium text-xs md:text-sm">
                      {activity.action}
                    </p>
                    <p className="text-gray-600 text-xs">{activity.details}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="border-gray-200 bg-white">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
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
                className="p-3 md:p-4 bg-gray-50 rounded border border-gray-200 flex items-start gap-2 md:gap-3"
              >
                <Icon size={20} className="text-gray-700 flex-shrink-0" />
                <div className="text-sm min-w-0">
                  <p className="text-gray-600">{item.label}</p>
                  <p className="text-gray-900 font-semibold text-sm">
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

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddEmployeeModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full space-y-4 shadow-lg"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Add New Employee
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Employee Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                <option>Select Department</option>
                <option>Engineering</option>
                <option>Sales</option>
                <option>HR</option>
                <option>Marketing</option>
              </select>
              <input
                type="text"
                placeholder="Position"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-semibold text-sm"
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddManagerModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full space-y-4 shadow-lg"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Add New Manager
            </h3>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500">
                <option>Select Employee to Promote</option>
                {employees.map((emp, idx) => (
                  <option key={idx}>{emp.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Team Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                placeholder="Team Size"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddManagerModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-semibold text-sm"
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateDeptModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full space-y-4 shadow-lg"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Create New Department
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Department Name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Department Head"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <textarea
                placeholder="Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                rows="3"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateDeptModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-semibold text-sm"
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAssignRolesModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full space-y-4 shadow-lg"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Assign Roles
            </h3>
            <div className="space-y-3">
              <select
                value={selectedRoleEmployee?.emp_id || ""}
                onChange={(e) => {
                  const emp = employees.find(e => e.emp_id === parseInt(e.target.value));
                  setSelectedRoleEmployee(emp);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
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
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-semibold text-sm"
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFireConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full space-y-4 shadow-lg"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center space-x-2">
              <AlertCircle size={24} className="text-red-600" />
              <span>Confirm Termination</span>
            </h3>
            <p className="text-gray-700 text-sm md:text-base">
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
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-semibold text-sm md:text-base"
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
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
