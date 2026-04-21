// 🌌 UNIVERSE UI APPLIED — Logic unchanged. Visual layer only.
// Changes: Changed login page to standalone universe UI card.

import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { UniverseBackground, RoleGradientOverlay, CursorGlow } from "../components/Effects";

// Hooks
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect them away from the login page completely.
  if (user) {
    const rolePath =
      user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "manager"
          ? "/manager/dashboard"
          : "/employee/dashboard";
    return <Navigate to={rolePath} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      // Navigate to correct dashboard seamlessly upon token storage
      if (loggedInUser.role === "admin") navigate("/admin/dashboard");
      else if (loggedInUser.role === "manager") navigate("/manager/dashboard");
      else navigate("/employee/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UniverseBackground role="employee" />
      <RoleGradientOverlay role="employee" />
      <CursorGlow role="employee" />

      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div
          className="w-full max-w-[400px] border border-white/10 rounded-[16px] p-8"
          style={{
            background:          'rgba(13, 13, 20, 0.80)',
            backdropFilter:      'blur(32px)',
            WebkitBackdropFilter:'blur(32px)',
            boxShadow:           '0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.6)',
          }}
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
            >
              <span className="text-white font-bold text-lg">NX</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-100 tracking-tight">NexusHR</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                  animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  className="bg-danger/10 text-danger px-4 py-3 rounded-[7px] text-xs font-medium border border-danger/20 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <Input
                icon={Mail}
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <Input
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              size="lg"
              className="w-full mt-4 font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                border: 'none',
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="w-full text-center mt-6">
            <p className="text-xs text-gray-500 font-medium">
              Secured by organizational access controls.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
