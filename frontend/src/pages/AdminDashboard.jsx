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
  const pendingLeaves = leaves
    .filter((l) => l.status === "Pending")
    .slice(0, 4);
  const lowPerformanceEmployees = employees
    .filter((e) => e.performance_score < 5)
    .slice(0, 3);
  const overdueTasks = tasks.filter((t) => t.status === "pending").slice(0, 3);
  const employeeTaskStats = employees.map((emp) => {
    const empTasks = tasks.filter((t) => t.emp_id === emp.emp_id);
    return {
      emp_id: emp.emp_id,
      emp_name: emp.name,
      total: empTasks.length,
      completed: empTasks.filter((t) => t.status === "completed").length,
      pending: empTasks.filter((t) => t.status === "pending").length,
    };
  });

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

  return (
    <div className="p-4 md:p-8 font-inter max-w-7xl mx-auto space-y-6 md:space-y-8 text-gray-900">
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
        <Card className="border-gray-200 bg-white hover:border-blue-400 transition-colors">
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

        <Card className="border-gray-200 bg-white hover:border-green-400 transition-colors">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-green-100 rounded-lg flex-shrink-0">
              <Activity className="text-green-600" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">
                Active Employees
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {employees.filter((e) => e.status === "active").length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="border-gray-200 bg-white hover:border-yellow-400 transition-colors">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Inactive</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                {employees.filter((e) => e.status === "inactive").length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="border-gray-200 bg-white hover:border-purple-400 transition-colors">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-purple-100 rounded-lg flex-shrink-0">
              <Shield className="text-purple-600" size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Admin Access</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                2
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
            { icon: UserPlus, label: "Add Employee", color: "blue" },
            { icon: Shield, label: "Add Manager", color: "purple" },
            { icon: Home, label: "Create Department", color: "green" },
            { icon: Users, label: "Assign Roles", color: "yellow" },
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
            {overdueTasks.length > 0 ? (
              <>
                <div className="text-sm">
                  <p className="text-gray-900 font-semibold">
                    {overdueTasks.length} Overdue Tasks
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Tasks pending for more than 7 days
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-gray-900 font-semibold">
                    {lowPerformanceEmployees.length} Low Performance
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Employees with score below 5
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-sm">No critical alerts</p>
            )}
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

      {/* Employee Task Statistics */}
      <div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
          Employee Task Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-h-96 overflow-y-auto">
          {employeeTaskStats
            .filter((s) => s.total > 0)
            .map((stat, idx) => (
              <Card key={idx} className="border-gray-200 bg-white">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  {stat.emp_name}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xl md:text-2xl font-bold text-blue-600">
                      {stat.total}
                    </p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xl md:text-2xl font-bold text-green-600">
                      {stat.completed}
                    </p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <p className="text-xl md:text-2xl font-bold text-yellow-600">
                      {stat.pending}
                    </p>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
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
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map((leave, idx) => (
                <div
                  key={idx}
                  className="p-2 md:p-3 bg-gray-50 rounded border border-gray-200 text-sm"
                >
                  <p className="text-gray-900 font-medium">
                    {leave.leave_type || "Leave Request"}
                  </p>
                  <p className="text-gray-600 text-xs">Awaiting approval</p>
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
    </div>
  );
};

export default AdminDashboard;
