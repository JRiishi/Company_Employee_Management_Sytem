import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Lock,
  Clock,
  Bell,
  LogSquare,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Card from "../components/Card/Card";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("rbac");
  const [saveStatus, setSaveStatus] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const [rbacData, setRbacData] = useState({
    roles: [
      {
        id: 1,
        name: "Admin",
        description: "Full system access",
        userCount: 2,
      },
      {
        id: 2,
        name: "Manager",
        description: "Department management",
        userCount: 5,
      },
      {
        id: 3,
        name: "Employee",
        description: "Limited access",
        userCount: 45,
      },
    ],
  });

  const [permissions, setPermissions] = useState({
    Admin: {
      "View Employees": true,
      "Edit Employees": true,
      "Delete Employees": true,
      "Manage Tasks": true,
      "Approve Leaves": true,
      "System Settings": true,
      "View Reports": true,
      "Manage Roles": true,
    },
    Manager: {
      "View Employees": true,
      "Edit Employees": true,
      "Delete Employees": false,
      "Manage Tasks": true,
      "Approve Leaves": true,
      "System Settings": false,
      "View Reports": true,
      "Manage Roles": false,
    },
    Employee: {
      "View Employees": true,
      "Edit Employees": false,
      "Delete Employees": false,
      "Manage Tasks": false,
      "Approve Leaves": false,
      "System Settings": false,
      "View Reports": false,
      "Manage Roles": false,
    },
  });

  const [leavePolicy, setLeavePolicy] = useState({
    maxLeavesPerYear: 20,
    sickLeaves: 5,
    casualLeaves: 8,
    vacationLeaves: 7,
    approvalDays: 2,
    leaveTypes: [
      "Sick Leave",
      "Casual Leave",
      "Vacation Leave",
      "Paid Time Off",
    ],
  });

  const [workingHours, setWorkingHours] = useState({
    startTime: "09:00",
    endTime: "18:00",
    weekends: ["Saturday", "Sunday"],
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskReminders: true,
    leaveAlerts: true,
    approvalNotifications: true,
    weeklyReports: true,
    performanceAlerts: true,
  });

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      action: "Updated employee salary",
      user: "Admin User",
      timestamp: "2024-04-15 14:30",
      details: "John Doe - Salary increased to $75,000",
    },
    {
      id: 2,
      action: "Approved leave request",
      user: "Manager User",
      timestamp: "2024-04-15 13:15",
      details: "Jane Smith - Vacation Leave (5 days)",
    },
    {
      id: 3,
      action: "Created new employee",
      user: "Admin User",
      timestamp: "2024-04-15 10:45",
      details: "New employee: Robert Johnson",
    },
    {
      id: 4,
      action: "Changed system settings",
      user: "Admin User",
      timestamp: "2024-04-14 16:20",
      details: "Updated leave policy - Max leaves changed to 20",
    },
    {
      id: 5,
      action: "Updated role permissions",
      user: "Admin User",
      timestamp: "2024-04-14 11:30",
      details: "Manager role - Added 'View Reports' permission",
    },
  ]);

  const handlePermissionChange = (role, permission) => {
    setPermissions({
      ...permissions,
      [role]: {
        ...permissions[role],
        [permission]: !permissions[role][permission],
      },
    });
    setHasChanges(true);
  };

  const handleLeavePolicyChange = (field, value) => {
    setLeavePolicy({ ...leavePolicy, [field]: value });
    setHasChanges(true);
  };

  const handleWorkingHoursChange = (field, value) => {
    setWorkingHours({ ...workingHours, [field]: value });
    setHasChanges(true);
  };

  const handleNotificationChange = (setting) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting],
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setHasChanges(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1000);
  };

  const TabButton = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
        isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-8 font-inter max-w-7xl mx-auto space-y-8 text-gray-900">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Settings size={28} className="text-blue-600" />
            Admin Settings
          </h1>
          <p className="text-gray-600">
            Configure system settings, roles, and policies
          </p>
        </div>
        {hasChanges && (
          <motion.button
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700/50 text-white rounded-lg font-semibold transition-colors"
          >
            <Save size={18} />
            {saveStatus === "saving" ? "Saving..." : "Save Changes"}
          </motion.button>
        )}
      </div>

      {saveStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700"
        >
          <CheckCircle size={20} />
          <span>Settings saved successfully!</span>
        </motion.div>
      )}

      <div className="flex border-b border-gray-200 overflow-x-auto">
        <TabButton
          label="RBAC"
          isActive={activeTab === "rbac"}
          onClick={() => setActiveTab("rbac")}
        />
        <TabButton
          label="Permissions"
          isActive={activeTab === "permissions"}
          onClick={() => setActiveTab("permissions")}
        />
        <TabButton
          label="Leave Policy"
          isActive={activeTab === "leave"}
          onClick={() => setActiveTab("leave")}
        />
        <TabButton
          label="Working Hours"
          isActive={activeTab === "hours"}
          onClick={() => setActiveTab("hours")}
        />
        <TabButton
          label="Notifications"
          isActive={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
        />
        <TabButton
          label="Audit Logs"
          isActive={activeTab === "logs"}
          onClick={() => setActiveTab("logs")}
        />
      </div>

      {activeTab === "rbac" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={20} className="text-blue-600" />
              Role-Based Access Control
            </h2>
            <div className="space-y-4">
              {rbacData.roles.map((role) => (
                <div
                  key={role.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {role.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {role.userCount} users assigned
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-semibold">
                    Manage
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border-2 border-dashed border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 rounded-lg transition-colors font-semibold">
              + Add New Role
            </button>
          </Card>
        </motion.div>
      )}

      {activeTab === "permissions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Permissions Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                      Permission
                    </th>
                    {Object.keys(permissions).map((role) => (
                      <th
                        key={role}
                        className="text-center py-3 px-4 text-gray-900 font-semibold"
                      >
                        {role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(permissions.Admin || {}).map((perm) => (
                    <tr key={perm} className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {perm}
                      </td>
                      {Object.keys(permissions).map((role) => (
                        <td key={role} className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={permissions[role][perm]}
                            onChange={() =>
                              handlePermissionChange(role, perm)
                            }
                            className="w-5 h-5 cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === "leave" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Leave Policy Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Max Leaves Per Year
                </label>
                <input
                  type="number"
                  value={leavePolicy.maxLeavesPerYear}
                  onChange={(e) =>
                    handleLeavePolicyChange(
                      "maxLeavesPerYear",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Approval Processing Days
                </label>
                <input
                  type="number"
                  value={leavePolicy.approvalDays}
                  onChange={(e) =>
                    handleLeavePolicyChange(
                      "approvalDays",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Sick Leaves
                </label>
                <input
                  type="number"
                  value={leavePolicy.sickLeaves}
                  onChange={(e) =>
                    handleLeavePolicyChange(
                      "sickLeaves",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Casual Leaves
                </label>
                <input
                  type="number"
                  value={leavePolicy.casualLeaves}
                  onChange={(e) =>
                    handleLeavePolicyChange(
                      "casualLeaves",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Vacation Leaves
                </label>
                <input
                  type="number"
                  value={leavePolicy.vacationLeaves}
                  onChange={(e) =>
                    handleLeavePolicyChange(
                      "vacationLeaves",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Leave Types</h3>
              <div className="space-y-2">
                {leavePolicy.leaveTypes.map((type, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-900">{type}</span>
                    <button className="ml-auto text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 rounded-lg transition-colors font-semibold">
                + Add Leave Type
              </button>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === "hours" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Working Hours Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={workingHours.startTime}
                  onChange={(e) =>
                    handleWorkingHoursChange("startTime", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={workingHours.endTime}
                  onChange={(e) =>
                    handleWorkingHoursChange("endTime", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Work Days</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={workingHours.workDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleWorkingHoursChange("workDays", [
                            ...workingHours.workDays,
                            day,
                          ]);
                        } else {
                          handleWorkingHoursChange(
                            "workDays",
                            workingHours.workDays.filter((d) => d !== day)
                          );
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-900">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell size={20} className="text-blue-600" />
              Notification Settings
            </h2>
            <div className="space-y-4">
              {Object.keys(notifications).map((setting) => (
                <div
                  key={setting}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <label className="text-gray-900 font-semibold cursor-pointer">
                    {setting.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="checkbox"
                    checked={notifications[setting]}
                    onChange={() => handleNotificationChange(setting)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === "logs" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <LogSquare size={20} className="text-blue-600" />
              Audit Logs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                      Timestamp
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{log.user}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-6 w-full py-2 text-blue-600 hover:text-blue-700 font-semibold">
              View More Logs
            </button>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AdminSettings;
