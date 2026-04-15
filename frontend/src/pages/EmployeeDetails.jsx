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

  useEffect(() => {
    fetchEmployeeDetails();
    fetchEmployeeTasks();
  }, [empId]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/employee/${empId}`);
      if (response.success) {
        setEmployee(response.data);
      } else {
        setError("Failed to load employee details");
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setError(err?.message || "Failed to load employee details");
    } finally {
      setLoading(false);
    }
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
    <div className="p-4 md:p-10 lg:p-12 font-inter w-full space-y-8 md:space-y-10 animate-fade-in text-gray-900">
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
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">{employee.name}</h1>
        <div className="flex items-center gap-2 text-gray-600">
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
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-8 py-4 text-base font-semibold transition-all border-b-2 ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-8 py-4 text-base font-semibold transition-all border-b-2 ${
            activeTab === "tasks"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`px-8 py-4 text-base font-semibold transition-all border-b-2 ${
            activeTab === "leave"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
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
              <p className="text-sm text-gray-600 font-medium">Email</p>
              <p className="text-lg font-semibold text-gray-900 break-all">
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
              <p className="text-sm text-gray-600 font-medium">Department</p>
              <p className="text-lg font-semibold text-gray-900">
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
              <p className="text-sm text-gray-600 font-medium">Salary</p>
              <p className="text-lg font-semibold text-gray-900">
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
              <p className="text-sm text-gray-600 font-medium">Performance</p>
              <p className="text-lg font-semibold text-gray-900">
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
        <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2 text-gray-900">
          <Calendar size={32} className="text-blue-600" />
          Tasks & Assignments
        </h2>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center space-y-2">
              <p className="text-gray-600 font-medium text-base">Pending</p>
              <p className="text-5xl font-bold text-blue-700">
                {taskStats.pending}
              </p>
            </div>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <div className="text-center space-y-2">
              <p className="text-gray-600 font-medium text-base">Ongoing</p>
              <p className="text-5xl font-bold text-amber-700">
                {taskStats.ongoing}
              </p>
            </div>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <div className="text-center space-y-2">
              <p className="text-gray-600 font-medium text-base">Completed</p>
              <p className="text-5xl font-bold text-green-700">
                {taskStats.completed}
              </p>
            </div>
          </Card>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <Card className="border-gray-200 bg-white">
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <motion.div
                  key={task.task_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
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
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {task.Title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
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
          <Card className="border-gray-200 bg-white">
            <div className="text-center py-8 text-gray-500">
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
        <h2 className="text-2xl font-bold text-gray-900">
          Additional Information
        </h2>

        <Card className="border-gray-200 bg-white">
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Joining Date
            </p>
            <p className="text-lg font-semibold text-gray-900">
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
    </div>
  );
};

export default EmployeeDetails;
