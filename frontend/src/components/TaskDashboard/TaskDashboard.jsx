import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader,
  TrendingUp,
  Filter,
  RefreshCw,
} from "lucide-react";
import Card from "../Card/Card";
import TaskChart from "./TaskChart";
import api from "../../services/api";

const TaskDashboard = ({ empId, empName }) => {
  const [timeFilter, setTimeFilter] = useState("month");
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    ongoing: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch tasks data
  useEffect(() => {
    fetchTasks();
  }, [empId, timeFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(`Fetching tasks for emp_id: ${empId}, filter: ${timeFilter}`);

      // Fetch tasks for the employee with filter
      const response = await api.get(`/tasks/employee/${empId}`, {
        params: { filter: timeFilter },
      });

      console.log("API Response:", response);

      if (response.success && response.data) {
        const data = response.data;

        // Handle new format: { total, completed, pending, ongoing, completionRate, tasks }
        if (data.tasks && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
          setStats({
            total: data.total || 0,
            completed: data.completed || 0,
            pending: data.pending || 0,
            ongoing: data.ongoing || 0,
            completionRate: data.completionRate || 0,
          });
        }
        // Handle old format: just array of tasks
        else if (Array.isArray(data)) {
          setTasks(data);
          const stats_data = {
            total: data.length,
            completed: data.filter((t) => t.status === "completed").length,
            pending: data.filter((t) => t.status === "pending").length,
            ongoing: data.filter((t) => t.status === "in_progress").length,
            completionRate: 0,
          };
          stats_data.completionRate = stats_data.total > 0
            ? Math.round((stats_data.completed / stats_data.total) * 100)
            : 0;
          setStats(stats_data);
        }
      } else {
        setError("Failed to load tasks: Invalid response format");
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(`Failed to load tasks: ${err?.message || "Unknown error"}`);
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
  };

  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    } else if (sortBy === "status") {
      const statusOrder = { completed: 3, in_progress: 2, pending: 1 };
      return (
        (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0)
      );
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={18} />;
      case "in_progress":
        return <Clock size={18} />;
      case "pending":
        return <AlertCircle size={18} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Loader className="text-blue-600" size={48} />
        </motion.div>
        <span className="ml-4 text-gray-600 font-medium">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={28} className="text-blue-600" />
              Tasks & Performance
            </h2>
            <p className="text-gray-600">Task overview for {empName}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh tasks"
          >
            <RefreshCw
              size={20}
              className={`text-blue-600 ${refreshing ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2"
          >
            <AlertCircle size={20} />
            <div>
              <p className="font-semibold">Error loading tasks</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Time Filter Buttons */}
        <div className="flex gap-3 flex-wrap">
          {["week", "month", "year"].map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeFilter(period)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                timeFilter === period
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <Filter size={16} />
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards - 4 Column Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Tasks */}
        <motion.div
          whileHover={{ translateY: -4 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow cursor-pointer h-40 flex flex-col justify-center">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Tasks</p>
              <p className="text-4xl font-bold text-blue-700">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-2">
                All time tasks assigned
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          whileHover={{ translateY: -4 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
        >
          <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow cursor-pointer h-40 flex flex-col justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="text-green-700" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-4xl font-bold text-green-700">{stats.completed}</p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.total > 0
                  ? `${Math.round((stats.completed / stats.total) * 100)}% completion`
                  : "No tasks"
                }
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Ongoing Tasks */}
        <motion.div
          whileHover={{ translateY: -4 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow cursor-pointer h-40 flex flex-col justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-blue-600" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-medium">In Progress</p>
              <p className="text-4xl font-bold text-blue-700">{stats.ongoing}</p>
              <p className="text-xs text-gray-500 mt-2">Currently working on</p>
            </div>
          </Card>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          whileHover={{ translateY: -4 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
        >
          <Card className="border-yellow-200 bg-yellow-50 hover:shadow-lg transition-shadow cursor-pointer h-40 flex flex-col justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="text-yellow-700" size={24} />
              </div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-4xl font-bold text-yellow-700">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-2">Waiting to start</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Completion Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-gray-200 bg-white">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={20} />
                <h3 className="font-semibold text-gray-900">Completion Rate</h3>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {stats.completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Charts Section - Two Column Layout */}
      <TaskChart stats={stats} />

      {/* Sort Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        <button
          onClick={() => setSortBy("date")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === "date"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Sort by Date
        </button>
        <button
          onClick={() => setSortBy("status")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === "status"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Sort by Status
        </button>
      </motion.div>

      {/* Tasks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Card className="border-gray-200 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Task Details</h3>

          {sortedTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 text-gray-500"
            >
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No tasks found for this period</p>
              <p className="text-sm text-gray-400 mt-1">
                Try selecting a different time period
              </p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Task Title
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Created
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Completed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTasks.map((task, idx) => (
                    <motion.tr
                      key={task.task_id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">
                          {task.Title || task.title || "Untitled Task"}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {getStatusIcon(task.status)}
                          {task.status?.charAt(0).toUpperCase() +
                            task.status?.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {task.created_at
                          ? new Date(task.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {task.completed_at
                          ? new Date(task.completed_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default TaskDashboard;
