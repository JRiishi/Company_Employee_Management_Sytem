// 🌌 UNIVERSE UI APPLIED — Logic unchanged. Visual layer only.
// Changes: Glass morphism effect with backdrop blur and role-based transparency.

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

  const displayName = user?.name || "User";
  const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Employee";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <aside 
      className="w-[240px] h-full border-r border-white/[0.06] flex flex-col flex-shrink-0"
      style={{
        background: 'rgba(13, 13, 20, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Logo Header */}
      <div className="h-[56px] flex items-center px-4 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-[6px] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">NX</span>
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-tight letter-spacing-tight">
            NexusHR
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 py-6 flex-grow overflow-y-auto">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 px-2">
          Workspace
        </div>
        <nav className="space-y-1">
          {menuItems.map((item, idx) => {
            const isActive = currentPath.startsWith(item.path);

            return (
              <Link
                key={idx}
                to={item.path}
                className={`
                  w-full flex items-center gap-3 px-3 h-[36px] rounded-[7px] 
                  transition-all duration-150 text-sm font-medium
                  ${isActive
                    ? "bg-accent-subtle text-accent-text border-l-2 border-accent -ml-px"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
                  }
                `}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-accent" : "text-text-muted"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Panel at Bottom */}
      <div className="p-3 border-t border-white/[0.06]">
        <div 
          className="flex items-center gap-3 px-3 py-3 rounded-[7px] mb-3"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-accent-text">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
            <p className="text-xs text-text-muted truncate">{displayRole}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-danger/10 text-danger hover:bg-danger/20 rounded-[7px] text-xs font-medium transition-all duration-150"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
