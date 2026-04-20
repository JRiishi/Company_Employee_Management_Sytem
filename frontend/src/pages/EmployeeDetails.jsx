// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader,
  Trash2,
} from "lucide-react";
import Card from "../components/Card/Card";
import TaskDashboard from "../components/TaskDashboard/TaskDashboard";
import EmployeeLeave from "../components/EmployeeLeave/EmployeeLeave";
import api from "../services/api";

const EmployeeDetails = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, tasks, or leave
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);
  const [terminatingLoading, setTerminatingLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchEmployeeDetails();
    fetchEmployeeTasks();
  }, [empId]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // Try to fetch from API first
      const response = await api.get(`/admin/employee/${empId}`);
      if (response.success) {
        setEmployee(response.data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error fetching from API:", err);
      // Fall through to check localStorage
    }

    // If API fails, try to find in localStorage
    try {
      const addedEmployees = localStorage.getItem("addedEmployees");
      if (addedEmployees) {
        const added = JSON.parse(addedEmployees);
        const found = added.find((e) => e.emp_id === parseInt(empId));
        if (found) {
          setEmployee(found);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Error checking localStorage:", err);
    }

    // If neither API nor localStorage has the employee
    setError("Employee not found");
    setLoading(false);
  };

  const fetchEmployeeTasks = async () => {
    try {
      // Fetch only current week tasks for overview
      const response = await api.get(`/tasks/employee/${empId}`, {
        params: { filter: "week" },
      });
      if (response.success && response.data) {
        // Extract tasks array from new API format
        const tasksArray = Array.isArray(response.data) ? response.data : response.data?.tasks || [];
        setTasks(tasksArray);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  const taskStats = {
    pending: tasks.filter((t) => t.status === "pending").length,
    ongoing: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const handleTerminate = async () => {
    if (!employee) return;

    try {
      setTerminatingLoading(true);

      // Check if this is a new employee (in localStorage)
      const addedEmployees = localStorage.getItem("addedEmployees");
      const addedList = addedEmployees ? JSON.parse(addedEmployees) : [];
      const isNewEmployee = addedList.some((e) => e.emp_id === employee.emp_id);

      if (isNewEmployee) {
        // Remove from localStorage
        const updated = addedList.filter((e) => e.emp_id !== employee.emp_id);
        localStorage.setItem("addedEmployees", JSON.stringify(updated));

        setSubmitStatus({
          type: "success",
          message: `${employee.name} has been terminated.`,
        });
      } else {
        // Call API for regular employees
        const response = await api.post("/admin/fire-employee", {
          emp_id: employee.emp_id,
          reason: "Terminated by admin",
        });

        if (!response.success) {
          throw new Error(response.message || "Failed to terminate employee");
        }

        setSubmitStatus({
          type: "success",
          message: `${employee.name} has been terminated.`,
        });
      }

      setShowTerminateConfirm(false);
      setTimeout(() => {
        navigate("/admin/employees");
      }, 1500);
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.message || "Error terminating employee",
      });
    } finally {
      setTerminatingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 font-inter max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-8 font-inter max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/admin/employees")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Employees
        </button>
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={24} />
          <span>{error || "Employee not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 lg:p-12 font-inter w-full space-y-8 md:space-y-10 animate-fade-in text-text-primary">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/employees")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium text-base"
      >
        <ArrowLeft size={24} />
        Back to Employees
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary">{employee.name}</h1>
        <div className="flex items-center gap-2 text-text-primary">
          <span
            className={`px-4 py-2 rounded-full text-base font-semibold ${
              employee.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {employee.status?.charAt(0).toUpperCase() +
              employee.status?.slice(1)}
          </span>
          {employee.status !== "terminated" && (
            <button
              onClick={() => setShowTerminateConfirm(true)}
              className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              Terminate
            </button>
          )}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-3 border-b border-white/10">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-8 py-4 text-base font-semibold transition-all border-b-2 ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-text-primary hover:text-text-primary"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-8 py-4 text-base font-semibold transition-all border-b-2 ${
            activeTab === "tasks"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-text-primary hover:text-text-primary"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`px-8 py-4 text-base font-semibold transition-all border-b-2 ${
            activeTab === "leave"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-text-primary hover:text-text-primary"
          }`}
        >
          Leave
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "overview" ? (
        <>
          {/* Main Information Grid for Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Email Card */}
        <Card className="border-blue-200 bg-blue-50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg shrink-0">
              <Mail className="text-blue-700" size={24} />
            </div>
            <div>
              <p className="text-sm text-text-primary font-medium">Email</p>
              <p className="text-lg font-semibold text-text-primary break-all">
                {employee.email}
              </p>
            </div>
          </div>
        </Card>

        {/* Department Card */}
        <Card className="border-purple-200 bg-purple-50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg shrink-0">
              <Briefcase className="text-purple-700" size={24} />
            </div>
            <div>
              <p className="text-sm text-text-primary font-medium">Department</p>
              <p className="text-lg font-semibold text-text-primary">
                {employee.department || "N/A"}
              </p>
            </div>
          </div>
        </Card>

        {/* Salary Card */}
        <Card className="border-green-200 bg-green-50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg shrink-0">
              <DollarSign className="text-green-700" size={24} />
            </div>
            <div>
              <p className="text-sm text-text-primary font-medium">Salary</p>
              <p className="text-lg font-semibold text-text-primary">
                ${employee.salary?.toLocaleString() || "N/A"}
              </p>
            </div>
          </div>
        </Card>

        {/* Performance Card */}
        <Card className="border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg shrink-0">
              <AlertCircle className="text-amber-700" size={24} />
            </div>
            <div>
              <p className="text-sm text-text-primary font-medium">Performance</p>
              <p className="text-lg font-semibold text-text-primary">
                {employee.performance_score || "N/A"}/10
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tasks Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 text-text-primary">
          <Calendar size={32} className="text-blue-600" />
          Tasks & Assignments
        </h2>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center space-y-2">
              <p className="text-text-primary font-medium text-base">Pending</p>
              <p className="text-5xl font-bold text-blue-700">
                {taskStats.pending}
              </p>
            </div>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <div className="text-center space-y-2">
              <p className="text-text-primary font-medium text-base">Ongoing</p>
              <p className="text-5xl font-bold text-amber-700">
                {taskStats.ongoing}
              </p>
            </div>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <div className="text-center space-y-2">
              <p className="text-text-primary font-medium text-base">Completed</p>
              <p className="text-5xl font-bold text-green-700">
                {taskStats.completed}
              </p>
            </div>
          </Card>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <Card className="border-white/10 bg-[#13131C]">
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <motion.div
                  key={task.task_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-[#13131C] rounded-lg border border-white/10 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      task.status === "completed"
                        ? "bg-green-100"
                        : task.status === "in_progress"
                          ? "bg-amber-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <CheckCircle
                      className={`${
                        task.status === "completed"
                          ? "text-green-700"
                          : task.status === "in_progress"
                            ? "text-amber-700"
                            : "text-blue-700"
                      }`}
                      size={20}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-primary mb-1">
                      {task.Title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-text-primary">
                      <span
                        className={`px-2 py-1 rounded font-medium ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "in_progress"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {task.status?.charAt(0).toUpperCase() +
                          task.status?.slice(1)}
                      </span>
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="border-white/10 bg-[#13131C]">
            <div className="text-center py-8 text-text-primary">
              No tasks assigned to this employee
            </div>
          </Card>
        )}
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-text-primary">
          Additional Information
        </h2>

        <Card className="border-white/10 bg-[#13131C]">
          <div>
            <p className="text-sm text-text-primary mb-2 font-medium">
              Joining Date
            </p>
            <p className="text-lg font-semibold text-text-primary">
              {employee.joining_date
                ? new Date(employee.joining_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </Card>
      </motion.div>
        </>
      ) : activeTab === "tasks" ? (
        /* Tasks Tab Content */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TaskDashboard empId={empId} empName={employee.name} />
        </motion.div>
      ) : (
        /* Leave Tab Content */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmployeeLeave empId={empId} empName={employee.name} />
        </motion.div>
      )}

      {/* Submit Status Message */}
      {submitStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-8 right-8 p-4 rounded-lg flex items-center gap-3 ${
            submitStatus.type === "success"
              ? "bg-green-500/10 border border-green-500/50 text-green-700"
              : "bg-red-500/10 border border-red-500/50 text-red-700"
          }`}
        >
          {submitStatus.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{submitStatus.message}</span>
        </motion.div>
      )}

      {/* Terminate Confirmation Modal */}
      {showTerminateConfirm && employee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowTerminateConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#13131C] rounded-xl border border-white/10 p-6 max-w-md w-full space-y-4 shadow-xl"
          >
            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertCircle size={24} />
              Confirm Termination
            </h3>
            <p className="text-text-primary">
              Are you sure you want to terminate{" "}
              <span className="font-bold text-text-primary">
                {employee.name}
              </span>
              ?
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowTerminateConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-text-primary rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleTerminate}
                disabled={terminatingLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-700/50 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {terminatingLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Terminating...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Terminate
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeDetails;
