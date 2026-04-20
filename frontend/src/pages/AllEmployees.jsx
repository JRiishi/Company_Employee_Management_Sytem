// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Eye,
  Trash2,
  Loader,
  AlertCircle,
  CheckCircle,
  Download,
  ChevronDown,
  MoreVertical,
  Filter,
  X,
} from "lucide-react";
import Card from "../components/Card/Card";
import api from "../services/api";

const AllEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedData, setExpandedData] = useState({});
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    performanceMin: 0,
    performanceMax: 10,
    salaryMin: 0,
    salaryMax: 500000,
  });
  const [showFireConfirm, setShowFireConfirm] = useState(false);
  const [employeeToFire, setEmployeeToFire] = useState(null);
  const [firingLoading, setFiringLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [departments, setDepartments] = useState([]);
  const [expandingId, setExpandingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, employees]);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await api.get("/admin/employees");
      if (response.success) {
        let data = response.data || [];
        // Merge with added employees from localStorage
        const addedEmployees = localStorage.getItem("addedEmployees");
        if (addedEmployees) {
          const added = JSON.parse(addedEmployees);
          data = [...data, ...added];
        }
        setEmployees(data);
        const depts = [...new Set(data.map((e) => e.department))].filter(Boolean);
        setDepartments(depts);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setSubmitStatus({ type: "error", message: "Failed to load employees" });
    } finally {
      setEmployeesLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter((emp) => emp.department === filters.department);
    }

    if (filters.status) {
      filtered = filtered.filter((emp) => emp.status === filters.status);
    }

    filtered = filtered.filter(
      (emp) =>
        emp.performance_score >= filters.performanceMin &&
        emp.performance_score <= filters.performanceMax &&
        emp.salary >= filters.salaryMin &&
        emp.salary <= filters.salaryMax
    );

    setFilteredEmployees(filtered);
  };

  const toggleRowSelection = (empId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(empId)) {
      newSelected.delete(empId);
    } else {
      newSelected.add(empId);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredEmployees.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredEmployees.map((e) => e.emp_id)));
    }
  };

  const expandRow = async (emp) => {
    if (expandedRow === emp.emp_id) {
      setExpandedRow(null);
      return;
    }

    setExpandingId(emp.emp_id);
    try {
      const tasksRes = await api.get(`/tasks/employee/${emp.emp_id}?filter=week`);
      const leavesRes = await api.get(
        `/leaves/employee/${emp.emp_id}?filter=year`
      );

      setExpandedData({
        [emp.emp_id]: {
          tasks: tasksRes.data?.tasks || [],
          leaves: leavesRes.data || {},
        },
      });
      setExpandedRow(emp.emp_id);
    } catch (err) {
      console.error("Error expanding row:", err);
    } finally {
      setExpandingId(null);
    }
  };

  const bulkAction = (action) => {
    if (selectedRows.size === 0) return;

    if (action === "delete") {
      if (window.confirm(`Delete ${selectedRows.size} employees?`)) {
        setSubmitStatus({
          type: "success",
          message: `${selectedRows.size} employees deleted.`,
        });
        setSelectedRows(new Set());
      }
    } else if (action === "active") {
      setSubmitStatus({
        type: "success",
        message: `${selectedRows.size} employees marked as active.`,
      });
      setSelectedRows(new Set());
    } else if (action === "inactive") {
      setSubmitStatus({
        type: "success",
        message: `${selectedRows.size} employees marked as inactive.`,
      });
      setSelectedRows(new Set());
    }
    setShowBulkMenu(false);
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Department",
      "Salary",
      "Performance",
      "Status",
    ];
    const rows = filteredEmployees.map((emp) => [
      emp.name,
      emp.email,
      emp.department,
      emp.salary,
      emp.performance_score,
      emp.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

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

  return (
    <div className="p-8 font-inter max-w-7xl mx-auto space-y-6 text-text-primary">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            All Employees
          </h1>
          <p className="text-text-primary">
            Manage and view all employees in the organization
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {submitStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center justify-between ${
            submitStatus.type === "success"
              ? "bg-green-500/10 border border-green-500/50 text-green-700"
              : "bg-red-500/10 border border-red-500/50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            {submitStatus.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{submitStatus.message}</span>
          </div>
          <button
            onClick={() => setSubmitStatus({ type: "", message: "" })}
            className="text-text-primary hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}

      <Card className="border-white/10 ">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
              <Users size={24} className="text-blue-600" />
              Employee Directory
            </h2>
            <span className="text-sm text-text-primary">
              {filteredEmployees.length} employees
            </span>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1A1A26] px-4 py-2 border border-white/10 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A26] hover:bg-[#20202F] text-text-primary rounded-lg transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
            {selectedRows.size > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBulkMenu(!showBulkMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors font-semibold"
                >
                  <MoreVertical size={18} />
                  Bulk ({selectedRows.size})
                </button>
                {showBulkMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2  border border-white/10 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-10 min-w-48"
                  >
                    <button
                      onClick={() => bulkAction("active")}
                      className="w-full text-left px-4 py-2 hover:bg-[#1A1A26] transition-colors text-text-primary border-b border-white/10"
                    >
                      Mark Active
                    </button>
                    <button
                      onClick={() => bulkAction("inactive")}
                      className="w-full text-left px-4 py-2 hover:bg-[#1A1A26] transition-colors text-text-primary border-b border-white/10"
                    >
                      Mark Inactive
                    </button>
                    <button
                      onClick={() => bulkAction("delete")}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                    >
                      Delete Selected
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className=" p-4 rounded-lg border border-white/10 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={filters.department}
                  onChange={(e) =>
                    setFilters({ ...filters, department: e.target.value })
                  }
                  className="px-3 py-2  border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="px-3 py-2  border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                </select>

                <div>
                  <label className="text-xs text-text-primary">Performance</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={filters.performanceMin}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          performanceMin: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Min"
                      className="flex-1 px-2 py-2  border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={filters.performanceMax}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          performanceMax: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Max"
                      className="flex-1 px-2 py-2  border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-text-primary">Salary Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.salaryMin}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          salaryMin: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Min"
                      className="flex-1 px-2 py-2  border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      value={filters.salaryMax}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          salaryMax: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Max"
                      className="flex-1 px-2 py-2  border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  setFilters({
                    department: "",
                    status: "",
                    performanceMin: 0,
                    performanceMax: 10,
                    salaryMin: 0,
                    salaryMax: 500000,
                  })
                }
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Reset Filters
              </button>
            </motion.div>
          )}

          {employeesLoading ? (
            <div className="text-center py-12 text-text-primary flex items-center justify-center gap-2">
              <Loader size={20} className="animate-spin" />
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12 text-text-primary">
              No employees found
            </div>
          ) : (
            <div className="overflow-x-auto border border-white/10 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 ">
                    <th className="text-left p-4 text-text-primary font-semibold w-12">
                      <input
                        type="checkbox"
                        checked={
                          selectedRows.size === filteredEmployees.length &&
                          filteredEmployees.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary font-semibold">
                      Name
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary font-semibold">
                      Email
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary font-semibold">
                      Department
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary font-semibold">
                      Salary
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary font-semibold">
                      Performance
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary font-semibold">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-text-primary font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, idx) => (
                    <React.Fragment key={emp.emp_id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => navigate(`/admin/employee/${emp.emp_id}`)}
                        className="border-b border-white/10 hover: transition-colors cursor-pointer"
                      >
                        <td
                          className="p-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows.has(emp.emp_id)}
                            onChange={() => toggleRowSelection(emp.emp_id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-4 text-text-primary font-medium">
                          {emp.name}
                        </td>
                        <td className="py-4 px-4 text-text-primary text-sm">
                          {emp.email}
                        </td>
                        <td className="py-4 px-4 text-text-primary">
                          {emp.department || "N/A"}
                        </td>
                        <td className="py-4 px-4 text-text-primary font-semibold">
                          ${emp.salary?.toLocaleString() || "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              emp.performance_score >= 8
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : emp.performance_score >= 6
                                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {emp.performance_score || 0}/10
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              emp.status === "active"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : emp.status === "inactive"
                                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {emp.status?.charAt(0).toUpperCase() +
                              emp.status?.slice(1)}
                          </span>
                        </td>
                        <td
                          className="py-4 px-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex gap-2">
                            <button
                              onClick={() => expandRow(emp)}
                              disabled={expandingId === emp.emp_id}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-600 hover:text-blue-700 disabled:opacity-50"
                              title="View Details"
                            >
                              <ChevronDown
                                size={18}
                                className={`transform transition-transform ${
                                  expandedRow === emp.emp_id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/employee/${emp.emp_id}`)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                              title="View Employee"
                            >
                              <Eye size={18} />
                            </button>
                            {emp.status !== "terminated" && (
                              <button
                                onClick={() => {
                                  setEmployeeToFire(emp);
                                  setShowFireConfirm(true);
                                }}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-600 hover:text-red-700"
                                title="Fire Employee"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>

                      {expandedRow === emp.emp_id && expandedData[emp.emp_id] && (
                        <tr className=" border-b border-white/10">
                          <td colSpan="8" className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="font-semibold text-text-primary mb-3">
                                  Recent Tasks (This Week)
                                </h4>
                                <div className="space-y-2">
                                  {expandedData[emp.emp_id].tasks.slice(0, 3)
                                    .length > 0 ? (
                                    expandedData[emp.emp_id].tasks
                                      .slice(0, 3)
                                      .map((task, i) => (
                                        <div
                                          key={i}
                                          className="text-sm px-3 py-2  rounded border border-white/10"
                                        >
                                          <p className="font-medium text-text-primary">
                                            {task.title || "Untitled"}
                                          </p>
                                          <p className="text-xs text-text-primary">
                                            {task.status}
                                          </p>
                                        </div>
                                      ))
                                  ) : (
                                    <p className="text-sm text-text-primary">
                                      No tasks this week
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-text-primary mb-3">
                                  Leave Summary (This Year)
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between  rounded border border-white/10 p-2">
                                    <span className="text-text-primary">
                                      Total Leaves:
                                    </span>
                                    <span className="font-semibold text-text-primary">
                                      {expandedData[emp.emp_id].leaves
                                        .total_leaves || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between  rounded border border-white/10 p-2">
                                    <span className="text-text-primary">
                                      Days Used:
                                    </span>
                                    <span className="font-semibold text-text-primary">
                                      {expandedData[emp.emp_id].leaves
                                        .total_days || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between  rounded border border-white/10 p-2">
                                    <span className="text-text-primary">
                                      Approved:
                                    </span>
                                    <span className="font-semibold text-green-700">
                                      {expandedData[
                                        emp.emp_id
                                      ].leaves.leaves?.filter(
                                        (l) => l.status === "Approved"
                                      ).length || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-text-primary mb-3">
                                  Performance Trend
                                </h4>
                                <div className=" rounded border border-white/10 p-4">
                                  <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                      {emp.performance_score}/10
                                    </div>
                                    <p
                                      className={`text-sm mt-2 ${
                                        emp.performance_score >= 8
                                          ? "text-green-600"
                                          : emp.performance_score >= 6
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                      }`}
                                    >
                                      {emp.performance_score >= 8
                                        ? "Excellent"
                                        : emp.performance_score >= 6
                                          ? "Good"
                                          : "Needs Improvement"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {showFireConfirm && employeeToFire && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowFireConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className=" rounded-xl border border-white/10 p-6 max-w-md w-full space-y-4 shadow-xl"
          >
            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertCircle size={24} />
              Confirm Termination
            </h3>
            <p className="text-text-primary">
              Are you sure you want to terminate{" "}
              <span className="font-bold text-text-primary">
                {employeeToFire.name}
              </span>
              ?
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowFireConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-text-primary rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleFireEmployee}
                disabled={firingLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-700/50 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {firingLoading ? (
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

export default AllEmployees;
