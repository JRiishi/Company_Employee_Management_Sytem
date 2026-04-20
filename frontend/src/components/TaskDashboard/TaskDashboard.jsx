// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

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
        return "bg-[#1A1A26] text-text-primary";
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
        <span className="ml-4 text-text-primary font-medium">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header with Filters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary flex items-center gap-2">
              <Calendar size={32} className="text-blue-600" />
              Tasks & Performance
            </h2>
            <p className="text-text-primary text-base">Task overview for {empName}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh tasks"
          >
            <RefreshCw
              size={24}
              className={`text-blue-600 ${refreshing ? "animate-spin" : ""}`}
            />
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 md:p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-base">Error loading tasks</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Time Filter Buttons */}
        <div className="flex gap-3 flex-wrap">
          {["week", "month", "year"].map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeFilter(period)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 text-base ${
                timeFilter === period
                  ? "bg-blue-600 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                  : "bg-[#20202F] text-text-primary hover:bg-gray-300"
              }`}
            >
              <Filter size={18} />
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Cards - 4 Column Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Tasks */}
        <motion.div
          whileHover={{ translateY: -4 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="border-blue-200 bg-blue-50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-shadow cursor-pointer min-h-48 flex flex-col justify-center">
            <div className="text-center space-y-2">
              <p className="text-text-primary text-sm font-medium">Total Tasks</p>
              <p className="text-5xl font-bold text-blue-700">{stats.total}</p>
              <p className="text-xs text-text-primary mt-2">
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
          <Card className="border-green-200 bg-green-50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-shadow cursor-pointer min-h-48 flex flex-col justify-center">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="text-green-700" size={28} />
              </div>
              <p className="text-text-primary text-sm font-medium">Completed</p>
              <p className="text-5xl font-bold text-green-700">{stats.completed}</p>
              <p className="text-xs text-text-primary mt-2">
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
          <Card className="border-blue-200 bg-blue-50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-shadow cursor-pointer min-h-48 flex flex-col justify-center">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-blue-600" size={28} />
              </div>
              <p className="text-text-primary text-sm font-medium">In Progress</p>
              <p className="text-5xl font-bold text-blue-700">{stats.ongoing}</p>
              <p className="text-xs text-text-primary mt-2">Currently working on</p>
            </div>
          </Card>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          whileHover={{ translateY: -4 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
        >
          <Card className="border-yellow-200 bg-yellow-50 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-shadow cursor-pointer min-h-48 flex flex-col justify-center">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="text-yellow-700" size={28} />
              </div>
              <p className="text-text-primary text-sm font-medium">Pending</p>
              <p className="text-5xl font-bold text-yellow-700">{stats.pending}</p>
              <p className="text-xs text-text-primary mt-2">Waiting to start</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Completion Progress Bar */}
      <Card className="border-white/10 bg-[#13131C]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              <h3 className="font-semibold text-text-primary">Completion Rate</h3>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {stats.completionRate}%
            </span>
          </div>
          <div className="w-full bg-[#20202F] rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
            />
          </div>
        </div>
      </Card>

      {/* Charts Section - Two Column Layout */}
      <TaskChart stats={stats} />

      {/* Sort Options */}
      <div className="flex gap-3">
        <button
          onClick={() => setSortBy("date")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === "date"
              ? "bg-blue-600 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
              : "bg-[#20202F] text-text-primary hover:bg-gray-300"
          }`}
        >
          Sort by Date
        </button>
        <button
          onClick={() => setSortBy("status")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            sortBy === "status"
              ? "bg-blue-600 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
              : "bg-[#20202F] text-text-primary hover:bg-gray-300"
          }`}
        >
          Sort by Status
        </button>
      </div>

      {/* Tasks Table */}
      <Card className="border-white/10 bg-[#13131C]">
        <h3 className="text-lg font-bold text-text-primary mb-4">Task Details</h3>

        {sortedTasks.length === 0 ? (
          <div className="text-center py-12 text-text-primary">
            <Calendar size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No tasks found for this period</p>
            <p className="text-sm text-text-primary mt-1">
              Try selecting a different time period
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task, idx) => (
              <motion.div
                key={task.task_id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="p-4 bg-[#13131C] rounded-lg border border-white/10 hover:border-blue-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary text-base">
                        {task.Title || task.title || "Untitled Task"}
                      </h4>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status?.charAt(0).toUpperCase() +
                        task.status?.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-text-primary text-xs font-medium">Created</p>
                      <p className="text-text-primary font-semibold">
                        {task.created_at
                          ? new Date(task.created_at).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-primary text-xs font-medium">Due Date</p>
                      <p className="text-text-primary font-semibold">
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-primary text-xs font-medium">Completed</p>
                      <p className="text-text-primary font-semibold">
                        {task.completed_at
                          ? new Date(task.completed_at).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TaskDashboard;
