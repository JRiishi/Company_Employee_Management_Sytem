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
} from "lucide-react";
import Card from "../components/Card/Card";
import api from "../services/api";

const AllEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFireConfirm, setShowFireConfirm] = useState(false);
  const [employeeToFire, setEmployeeToFire] = useState(null);
  const [firingLoading, setFiringLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [employeeTasks, setEmployeeTasks] = useState([]);

  // Fetch all employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

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
      setSubmitStatus({ type: "error", message: "Failed to load employees" });
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Fetch employee tasks/assignments
  const viewEmployeeAssignments = async (emp) => {
    try {
      setTasksLoading(true);
      setSelectedEmployee(emp);

      // Fetch tasks for this employee
      const response = await api.get(`/tasks/employee/${emp.emp_id}`);
      if (response.success) {
        const tasks = response.data || [];
        // Filter pending tasks
        const pendingTasks = tasks.filter((t) => t.status !== "completed");
        setEmployeeTasks(pendingTasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setEmployeeTasks([]);
    } finally {
      setTasksLoading(false);
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

  return (
    <div className="p-8 font-inter max-w-7xl mx-auto space-y-8 animate-fade-in text-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          All Employees
        </h1>
        <p className="text-gray-600">
          Manage and view all employees in the organization
        </p>
      </div>

      {/* Status Messages */}
      {submitStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            submitStatus.type === "success"
              ? "bg-green-500/10 border border-green-500/50 text-green-400"
              : "bg-red-500/10 border border-red-500/50 text-red-400"
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

      {/* Main Content */}
      <Card className="border-blue-200 bg-white">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center space-x-2 text-gray-900">
              <Users size={24} className="text-blue-600" />
              <span>Employee Directory</span>
            </h2>
            <span className="text-gray-600 text-sm">
              {filteredEmployees.length} employees
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Employees Table */}
          {employeesLoading ? (
            <div className="text-center py-8 text-gray-400">
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No employees found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">
                      Name
                    </th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">
                      Email
                    </th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">
                      Department
                    </th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">
                      Salary
                    </th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">
                      Performance
                    </th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, idx) => (
                    <motion.tr
                      key={emp.emp_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => navigate(`/admin/employee/${emp.emp_id}`)}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-gray-900 font-medium">
                        {emp.name}
                      </td>
                      <td className="py-4 px-4 text-gray-700 text-sm">
                        {emp.email}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {emp.department || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-semibold">
                        ${emp.salary?.toLocaleString() || "N/A"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.performance_score >= 8
                              ? "bg-green-100 text-green-800"
                              : emp.performance_score >= 6
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {emp.performance_score || 0}/10
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.status === "active"
                              ? "bg-green-100 text-green-800"
                              : emp.status === "inactive"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
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
                          {emp.status !== "terminated" && (
                            <button
                              onClick={() => {
                                setEmployeeToFire(emp);
                                setShowFireConfirm(true);
                              }}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                              title="Fire Employee"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Employee Assignments Modal */}
      {selectedEmployee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEmployee(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-xl border border-blue-500/50 p-6 max-w-2xl w-full max-h-96 overflow-y-auto space-y-4"
          >
            <h3 className="text-xl font-bold text-blue-400">
              Assignments - {selectedEmployee.name}
            </h3>

            {tasksLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Loader size={24} className="animate-spin mr-2" />
                Loading assignments...
              </div>
            ) : employeeTasks.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                No pending assignments
              </div>
            ) : (
              <div className="space-y-3">
                {employeeTasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:border-blue-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">
                        {task.Title || "Untitled"}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : task.status === "in_progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {task.status?.charAt(0).toUpperCase() +
                          task.status?.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Due: {task.due_date || "No deadline"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setSelectedEmployee(null)}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold mt-4"
            >
              Close
            </button>
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
            className="bg-gray-800 rounded-xl border border-red-500/50 p-6 max-w-md w-full space-y-4"
          >
            <h3 className="text-xl font-bold text-red-400 flex items-center space-x-2">
              <AlertCircle size={24} />
              <span>Confirm Termination</span>
            </h3>
            <p className="text-gray-300">
              Are you sure you want to terminate{" "}
              <span className="font-bold text-white">
                {employeeToFire.name}
              </span>
              ?
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowFireConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleFireEmployee}
                disabled={firingLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-700/50 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                {firingLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Terminating...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>Terminate</span>
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
