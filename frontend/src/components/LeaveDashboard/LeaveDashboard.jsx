import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader,
  Filter,
  RefreshCw,
  Users,
} from "lucide-react";
import Card from "../Card/Card";
import api from "../../services/api";

const LeaveDashboard = () => {
  const [timeFilter, setTimeFilter] = useState("month");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaveData();
  }, [timeFilter]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leaves/summary", {
        params: { filter: timeFilter },
      });

      if (response.success && response.data) {
        setEmployees(response.data.employees || []);
      } else {
        setError("Failed to load leave data");
      }
    } catch (err) {
      console.error("Error fetching leave data:", err);
      setError(`Failed to load leave data: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaveData();
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Sick Leave":
        return "bg-red-100 text-red-800";
      case "Casual Leave":
        return "bg-blue-100 text-blue-800";
      case "Vacation Leave":
        return "bg-green-100 text-green-800";
      case "Paid Time Off (PTO)":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Loader className="text-blue-600" size={48} />
        </motion.div>
        <span className="ml-4 text-gray-600 font-medium">
          Loading leave data...
        </span>
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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users size={32} className="text-blue-600" />
              Employee Leave Management
            </h1>
            <p className="text-gray-600">
              Track and manage employee leaves across the organization
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
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
            <p>{error}</p>
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

      {/* Employees Leave Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-gray-200 bg-white overflow-x-auto">
          {employees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">
                No leave data found for this period
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Role
                    </th>
                    <th className="text-center py-3 px-4 text-gray-700 font-semibold">
                      Total Leaves
                    </th>
                    <th className="text-center py-3 px-4 text-gray-700 font-semibold">
                      Total Days
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Sick Leave
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Casual Leave
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      Vacation Leave
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                      PTO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <motion.tr
                      key={emp.employee_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900">
                          {emp.name}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-600 text-sm">{emp.role}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {emp.total_leaves}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          {emp.total_days}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">
                          {emp.leave_breakdown["Sick Leave"] || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                          {emp.leave_breakdown["Casual Leave"] || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                          {emp.leave_breakdown["Vacation Leave"] || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                          {emp.leave_breakdown["Paid Time Off (PTO)"] || 0}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Leave Type Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-gray-200 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-800"></div>
              <span className="text-gray-700">
                <strong>Sick Leave</strong> - Medical/Health related
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-800"></div>
              <span className="text-gray-700">
                <strong>Casual Leave</strong> - Personal time off
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-800"></div>
              <span className="text-gray-700">
                <strong>Vacation Leave</strong> - Planned vacation
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-purple-100 border-2 border-purple-800"></div>
              <span className="text-gray-700">
                <strong>PTO</strong> - Paid Time Off
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LeaveDashboard;
