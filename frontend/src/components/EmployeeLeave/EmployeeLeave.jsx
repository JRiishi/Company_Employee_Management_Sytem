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
} from "lucide-react";
import Card from "../Card/Card";
import api from "../../services/api";

const EmployeeLeave = ({ empId, empName }) => {
  const [timeFilter, setTimeFilter] = useState("month");
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaveData();
  }, [empId, timeFilter]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/leaves/employee/${empId}`, {
        params: { filter: timeFilter },
      });

      if (response.success && response.data) {
        setLeaveData(response.data);
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
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Loader className="text-blue-600" size={48} />
        </motion.div>
        <span className="ml-4 text-gray-600 font-medium">Loading leave data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={28} className="text-blue-600" />
              Leave Records
            </h2>
            <p className="text-gray-600">Leave history for {empName}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={`text-blue-600 ${refreshing ? "animate-spin" : ""}`} />
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            <p>{error}</p>
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
      </div>

      {/* Leave Stats */}
      {leaveData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Leaves */}
          <motion.div whileHover={{ translateY: -4 }}>
            <Card className="border-blue-200 bg-blue-50 h-40 flex flex-col justify-center">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Leave Records</p>
                <p className="text-4xl font-bold text-blue-700">{leaveData.total_leaves || 0}</p>
                <p className="text-xs text-gray-500 mt-2">In {timeFilter} period</p>
              </div>
            </Card>
          </motion.div>

          {/* Approved Leave Days */}
          <motion.div whileHover={{ translateY: -4 }}>
            <Card className="border-green-200 bg-green-50 h-40 flex flex-col justify-center">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Approved Leave Days</p>
                <p className="text-4xl font-bold text-green-700">
                  {leaveData.leaves
                    ? leaveData.leaves
                        .filter((l) => l.status === "Approved")
                        .reduce((sum, l) => sum + l.duration, 0)
                    : 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">Days approved</p>
              </div>
            </Card>
          </motion.div>

          {/* Pending Leave Days */}
          <motion.div whileHover={{ translateY: -4 }}>
            <Card className="border-yellow-200 bg-yellow-50 h-40 flex flex-col justify-center">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Pending Leave Days</p>
                <p className="text-4xl font-bold text-yellow-700">
                  {leaveData.leaves
                    ? leaveData.leaves
                        .filter((l) => l.status === "Pending")
                        .reduce((sum, l) => sum + l.duration, 0)
                    : 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">Days pending</p>
              </div>
            </Card>
          </motion.div>

          {/* Rejected Leave Days */}
          <motion.div whileHover={{ translateY: -4 }}>
            <Card className="border-red-200 bg-red-50 h-40 flex flex-col justify-center">
              <div className="text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">Rejected Leave Days</p>
                <p className="text-4xl font-bold text-red-700">
                  {leaveData.leaves
                    ? leaveData.leaves
                        .filter((l) => l.status === "Rejected")
                        .reduce((sum, l) => sum + l.duration, 0)
                    : 0}
                </p>
                <p className="text-xs text-gray-500 mt-2">Days rejected</p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Leave Breakdown */}
      {leaveData && leaveData.leave_breakdown && (
        <Card className="border-gray-200 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: "Sick Leave", color: "bg-red-100 text-red-800" },
              { type: "Casual Leave", color: "bg-blue-100 text-blue-800" },
              { type: "Vacation Leave", color: "bg-green-100 text-green-800" },
              { type: "Paid Time Off (PTO)", color: "bg-purple-100 text-purple-800" },
            ].map((item) => (
              <div key={item.type} className={`p-4 rounded-lg text-center ${item.color}`}>
                <p className="text-sm font-medium mb-1">{item.type}</p>
                <p className="text-2xl font-bold">{leaveData.leave_breakdown[item.type] || 0}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Leave Records Table */}
      {leaveData && leaveData.leaves && leaveData.leaves.length > 0 && (
        <Card className="border-gray-200 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Records</h3>
          <div className="space-y-3">
            {leaveData.leaves.map((leave, idx) => (
              <motion.div
                key={leave.leave_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLeaveTypeColor(leave.leave_type)}`}>
                          {leave.leave_type}
                        </span>
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : leave.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium text-sm">
                        {leave.reason || "No reason provided"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Start Date</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(leave.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-medium">End Date</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(leave.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Duration</p>
                      <p className="text-gray-900 font-semibold">{leave.duration} day{leave.duration > 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-medium">Days Used</p>
                      <p className="text-gray-900 font-semibold">{leave.duration} of leave</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* No Leave Records */}
      {leaveData && (!leaveData.leaves || leaveData.leaves.length === 0) && (
        <Card className="border-gray-200 bg-white">
          <div className="text-center py-12 text-gray-500">
            <Calendar size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No leave records found for this period</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmployeeLeave;
