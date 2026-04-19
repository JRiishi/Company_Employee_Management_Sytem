import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Calendar,
  Settings,
  Command,
  Wallet,
  Shield,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dynamic menu based on role
  let menuItems = [];

  if (user?.role === "admin") {
    menuItems = [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/admin/dashboard",
      },
      {
        icon: BarChart2,
        label: "System Overview",
        path: "/admin/overview",
      },
      { icon: Users, label: "All Employees", path: "/admin/employees" },
      { icon: Settings, label: "Admin Settings", path: "/admin/settings" },
    ];
  } else if (user?.role === "manager") {
    menuItems = [
      {
        icon: LayoutDashboard,
        label: "Team Dashboard",
        path: "/manager/dashboard",
      },
      { icon: Settings, label: "Manager Settings", path: "/manager/settings" },
    ];
  } else {
    menuItems = [
      { icon: LayoutDashboard, label: "Overview", path: "/employee/dashboard" },
      { icon: CheckSquare, label: "My Tasks", path: "/employee/tasks" },
      { icon: BarChart2, label: "Performance", path: "/employee/performance" },
      { icon: Wallet, label: "Salary", path: "/employee/salary" },
      { icon: Settings, label: "Settings", path: "/employee/settings" },
    ];
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-gray-200 flex flex-col font-sans z-20">
      <div className="h-[72px] flex items-center px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Command className="w-5 h-5 text-white" />
          </div>
          <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
            Nexus HR
          </span>
        </div>
      </div>
      <div className="px-4 py-6 flex-grow overflow-y-auto">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Main Menu
        </div>
        <nav className="space-y-1">
          {menuItems.map((item, idx) => {
            const isActive = currentPath.startsWith(item.path);

            return (
              <Link
                key={idx}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 h-[40px] rounded-md transition-colors duration-150 text-[14px] ${
                  isActive
                    ? "bg-blue-50/80 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50/50 hover:text-gray-900 group"
                }`}
              >
                <item.icon
                  className={`w-[18px] h-[18px] ${isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Force Logout Button at Bottom of Sidebar */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Force Log Out
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
