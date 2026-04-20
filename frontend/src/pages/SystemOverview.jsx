// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Zap,
  BarChart3,
  Clock,
  ArrowUp,
  ArrowDown,
  X,
  Eye,
} from "lucide-react";
import Card from "../components/Card/Card";
import api from "../services/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const SystemOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalLeaves: 0,
    approvedLeaves: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [deptPerformance, setDeptPerformance] = useState([]);
  const [riskEmployees, setRiskEmployees] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [taskTimeline, setTaskTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    type: "", // "employees", "active", "tasks", "leaves"
    data: [],
  });

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const empRes = await api.get("/admin/employees");

      if (empRes.success) {
        let emps = empRes.data || [];

        // Load added employees from localStorage
        const addedEmployees = localStorage.getItem("addedEmployees");
        if (addedEmployees) {
          const added = JSON.parse(addedEmployees);
          emps = [...emps, ...added];
        }

        setEmployees(emps);

        const active = emps.filter((e) => e.status === "active").length;
        const inactive = emps.filter((e) => e.status === "inactive").length;

        const deptMap = {};
        emps.forEach((emp) => {
          if (!deptMap[emp.department]) {
            deptMap[emp.department] = {
              count: 0,
              totalPerf: 0,
              dept: emp.department,
            };
          }
          deptMap[emp.department].count++;
          deptMap[emp.department].totalPerf += emp.performance_score || 0;
        });

        const deptData = Object.values(deptMap).map((d) => ({
          department: d.dept,
          performance: parseFloat((d.totalPerf / d.count).toFixed(1)),
          employees: d.count,
        }));
        setDeptPerformance(deptData);

        const riskEmps = emps
          .filter((e) => e.performance_score < 5 || e.status === "inactive")
          .slice(0, 5)
          .map((e) => ({
            emp_id: e.emp_id,
            name: e.name,
            performance: e.performance_score,
            issue:
              e.performance_score < 5 ? "Low Performance" : "Inactive",
          }));
        setRiskEmployees(riskEmps);

        const topEmps = [...emps]
          .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0))
          .slice(0, 3)
          .map((e) => ({
            emp_id: e.emp_id,
            name: e.name,
            department: e.department,
            performance: e.performance_score,
          }));
        setTopPerformers(topEmps);

        setTaskTimeline([
          { day: "Mon", created: Math.floor(Math.random() * 15) + 5 },
          { day: "Tue", created: Math.floor(Math.random() * 15) + 5 },
          { day: "Wed", created: Math.floor(Math.random() * 15) + 8 },
          { day: "Thu", created: Math.floor(Math.random() * 15) + 6 },
          { day: "Fri", created: Math.floor(Math.random() * 15) + 10 },
          { day: "Sat", created: Math.floor(Math.random() * 15) + 2 },
          { day: "Sun", created: Math.floor(Math.random() * 15) + 3 },
        ]);

        setStats({
          totalEmployees: emps.length,
          activeEmployees: active,
          inactiveEmployees: inactive,
          totalTasks: Math.floor(Math.random() * 200) + 50,
          completedTasks: Math.floor(Math.random() * 100) + 20,
          pendingTasks: Math.floor(Math.random() * 80) + 10,
          totalLeaves: emps.length * 3,
          approvedLeaves: Math.floor(emps.length * 2.5),
        });
      }
    } catch (err) {
      console.error("Error fetching system data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatCardClick = async (type) => {
    let data = [];

    if (type === "employees") {
      data = employees.map((e) => ({
        name: e.name,
        email: e.email,
        department: e.department,
        performance: e.performance_score,
        status: e.status,
        salary: e.salary,
        emp_id: e.emp_id,
      }));
      setDetailModal({ isOpen: true, type, data });
    } else if (type === "active") {
      data = employees
        .filter((e) => e.status === "active")
        .map((e) => ({
          name: e.name,
          email: e.email,
          department: e.department,
          performance: e.performance_score,
          status: e.status,
          emp_id: e.emp_id,
        }));
      setDetailModal({ isOpen: true, type, data });
    } else if (type === "tasks") {
      // Fetch completed tasks from all employees in parallel
      try {
        const taskPromises = employees.map((emp) =>
          api
            .get(`/tasks/employee/${emp.emp_id}?filter=year`)
            .then((res) => {
              if (res.data?.tasks) {
                return res.data.tasks
                  .filter((t) => t.status === "completed")
                  .map((t) => ({
                    taskName: t.title || t.Title || "Untitled",
                    employee: emp.name,
                    status: t.status,
                    dueDate: t.due_date,
                    completedDate: t.completed_at,
                  }));
              }
              return [];
            })
            .catch(() => [])
        );

        const results = await Promise.all(taskPromises);
        data = results.flat();
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
      setDetailModal({ isOpen: true, type, data });
    } else if (type === "leaves") {
      // Fetch approved leaves from all employees in parallel
      try {
        const leavePromises = employees.map((emp) =>
          api
            .get(`/leaves/employee/${emp.emp_id}?filter=year`)
            .then((res) => {
              if (res.data?.leaves) {
                return res.data.leaves
                  .filter((l) => l.status === "Approved")
                  .map((l) => ({
                    leaveType: l.leave_type,
                    employee: emp.name,
                    reason: l.reason,
                    startDate: l.start_date,
                    endDate: l.end_date,
                    duration: l.duration,
                  }));
              }
              return [];
            })
            .catch(() => [])
        );

        const results = await Promise.all(leavePromises);
        data = results.flat();
      } catch (err) {
        console.error("Error fetching leaves:", err);
      }
      setDetailModal({ isOpen: true, type, data });
    }
  };

  const StatCard = ({ title, value, change, isPositive, icon: Icon, onClick }) => (
    <motion.div
      whileHover={{ translateY: -4, cursor: "pointer" }}
      onClick={onClick}
      className="h-full"
    >
      <Card className="border-white/10 bg-[#13131C] h-full flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-text-primary text-sm font-medium">{title}</h3>
          <Icon
            size={20}
            className={isPositive ? "text-green-600" : "text-red-600"}
          />
        </div>
        <div>
          <div className="text-3xl font-bold text-text-primary mb-2">{value}</div>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUp size={16} className="text-green-600" />
              ) : (
                <ArrowDown size={16} className="text-red-600" />
              )}
              <span
                className={`text-sm font-semibold ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.abs(change)}% this month
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  const DetailModal = () => {
    if (!detailModal.isOpen) return null;

    const getTableHeaders = () => {
      switch (detailModal.type) {
        case "employees":
        case "active":
          return ["Name", "Email", "Department", "Performance", "Status"];
        case "tasks":
          return ["Task Name", "Employee", "Status", "Due Date", "Completed Date"];
        case "leaves":
          return ["Leave Type", "Employee", "Reason", "Start Date", "End Date", "Duration"];
        default:
          return [];
      }
    };

    const getTableData = (item) => {
      switch (detailModal.type) {
        case "employees":
        case "active":
          return [
            item.name,
            item.email,
            item.department,
            `${item.performance}/10`,
            item.status,
          ];
        case "tasks":
          return [
            item.taskName,
            item.employee,
            item.status,
            item.dueDate,
            item.completedDate || "--",
          ];
        case "leaves":
          return [
            item.leaveType,
            item.employee,
            item.reason,
            item.startDate,
            item.endDate,
            `${item.duration} days`,
          ];
        default:
          return [];
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setDetailModal({ isOpen: false, type: "", data: [] })}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#13131C] rounded-xl border border-white/10 p-6 max-w-4xl w-full max-h-96 overflow-y-auto shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {detailModal.type === "employees" && "All Employees"}
              {detailModal.type === "active" && "Active Employees"}
              {detailModal.type === "tasks" && "Completed Tasks"}
              {detailModal.type === "leaves" && "Approved Leaves"}
            </h2>
            <button
              onClick={() => setDetailModal({ isOpen: false, type: "", data: [] })}
              className="text-text-primary hover:text-text-primary"
            >
              <X size={24} />
            </button>
          </div>

          {detailModal.data.length === 0 ? (
            <p className="text-center text-text-primary py-8">No data available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-[#13131C]">
                    {getTableHeaders().map((header) => (
                      <th
                        key={header}
                        className="text-left py-3 px-4 text-text-primary font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                    {(detailModal.type === "employees" || detailModal.type === "active") && (
                      <th className="text-left py-3 px-4 text-text-primary font-semibold">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {detailModal.data.map((item, i) => (
                    <tr key={i} className="border-b border-white/10 hover:bg-[#13131C]">
                      {getTableData(item).map((cell, j) => (
                        <td key={j} className="py-3 px-4 text-text-primary">
                          {cell}
                        </td>
                      ))}
                      {(detailModal.type === "employees" || detailModal.type === "active") && (
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              navigate(`/admin/employee/${item.emp_id}`);
                              setDetailModal({ isOpen: false, type: "", data: [] });
                            }}
                            className="p-1 hover:bg-blue-500/20 rounded text-blue-600 hover:text-blue-700"
                            title="View Employee"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 font-inter max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <div className="text-text-primary text-lg">Loading system overview...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 lg:p-12 font-inter w-full space-y-8 md:space-y-10 text-text-primary">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3">
          System Overview
        </h1>
        <p className="text-text-primary text-lg">
          Executive dashboard with key metrics and insights (click cards for details)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          change={5}
          isPositive={true}
          icon={Users}
          onClick={() => handleStatCardClick("employees")}
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          change={3}
          isPositive={true}
          icon={TrendingUp}
          onClick={() => handleStatCardClick("active")}
        />
        <StatCard
          title="Tasks Completed"
          value={stats.completedTasks}
          isPositive={true}
          icon={Zap}
          onClick={() => handleStatCardClick("tasks")}
        />
        <StatCard
          title="Leaves Approved"
          value={stats.approvedLeaves}
          isPositive={true}
          icon={Clock}
          onClick={() => handleStatCardClick("leaves")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-[#13131C]">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Department Performance Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="department" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Bar
                dataKey="performance"
                fill="#3b82f6"
                name="Avg Performance"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-white/10 bg-[#13131C]">
          <h2 className="text-xl font-bold text-text-primary mb-6">
            Task Creation Timeline
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={taskTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Line
                type="monotone"
                dataKey="created"
                stroke="#3b82f6"
                name="Tasks Created"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-red-200 bg-red-50">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle
              size={24}
              className="text-red-600 flex-shrink-0"
            />
            <div>
              <h2 className="text-xl font-bold text-red-900">Risk Panel</h2>
              <p className="text-sm text-red-700">
                Employees requiring attention
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {riskEmployees.length > 0 ? (
              riskEmployees.map((emp, i) => (
                <motion.div
                  key={i}
                  whileHover={{ translateX: 4, cursor: "pointer" }}
                  onClick={() => navigate(`/admin/employee/${emp.emp_id}`)}
                  className="bg-[#13131C] rounded-lg p-3 border border-red-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-shadow"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-text-primary">{emp.name}</p>
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                      {emp.issue}
                    </span>
                  </div>
                  {emp.performance && (
                    <p className="text-sm text-text-primary">
                      Performance: {emp.performance}/10
                    </p>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-text-primary text-center py-4">
                No risks detected
              </p>
            )}
          </div>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <div className="flex items-start gap-3 mb-4">
            <TrendingUp size={24} className="text-green-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-green-900">
                Top Performers
              </h2>
              <p className="text-sm text-green-700">
                Based on performance score
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {topPerformers.map((emp, i) => (
              <motion.div
                key={i}
                whileHover={{ translateX: 4, cursor: "pointer" }}
                onClick={() => navigate(`/admin/employee/${emp.emp_id}`)}
                className="bg-[#13131C] rounded-lg p-3 border border-green-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-shadow"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-text-primary">{emp.name}</p>
                  <span className="text-sm font-bold text-green-700">
                    {emp.performance}/10
                  </span>
                </div>
                <p className="text-sm text-text-primary">{emp.department}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="bg-[#13131C] rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-text-primary mb-1">Employee Database</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: "98%" }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-text-primary">98%</span>
              </div>
            </div>
            <div className="bg-[#13131C] rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-text-primary mb-1">Task Processing</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: "92%" }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-text-primary">92%</span>
              </div>
            </div>
            <div className="bg-[#13131C] rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-text-primary mb-1">Leave Processing</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: "95%" }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-text-primary">95%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-white/10 bg-[#13131C]">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Employee Status Distribution
        </h2>
        <div className="flex justify-center">
          <ResponsiveContainer width={300} height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Active", value: stats.activeEmployees },
                  { name: "Inactive", value: stats.inactiveEmployees },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <DetailModal />
    </div>
  );
};

export default SystemOverview;
