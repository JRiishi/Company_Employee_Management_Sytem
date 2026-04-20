// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: User authentication form

import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import Card from "../components/Card/Card";

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
    <div className="min-h-screen w-full flex bg-bg-base items-stretch relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_40%,#6366F1_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_70%_60%,#3B82F6_0%,transparent_50%)] pointer-events-none" />

      {/* 🔹 LEFT PANEL (Brand / Context) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center px-12 xl:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-accent rounded-[7px] flex items-center justify-center">
              <span className="text-base font-bold text-white">NX</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-text-primary">
              NexusHR
            </h1>
          </div>
          <p className="text-lg text-accent-text font-medium leading-snug max-w-lg mb-6">
            AI-powered workforce intelligence.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed max-w-md">
            Securely access your employee portal, manage organizational tasks,
            and evaluate analytical telemetry with intelligent automation.
          </p>
        </motion.div>
      </div>

      {/* 🔹 RIGHT PANEL (Login Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-[420px] flex flex-col"
        >
          {/* Mobile Brand Title (Only shows on small screens) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10 mt-[-40px]">
            <div className="w-10 h-10 bg-accent rounded-[6px] flex items-center justify-center">
              <span className="text-sm font-bold text-white">NX</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              NexusHR
            </h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
              Sign In
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Authenticate to access your workspace.
            </p>
          </div>

          <Card className="p-6 w-full">
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      overflow: "visible",
                    }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    className="bg-danger/10 text-danger px-4 py-3 rounded-[7px] text-xs font-medium border border-danger/20 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
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
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
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
                className="w-full mt-2 font-semibold"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Card>

          <div className="w-full text-center mt-6">
            <p className="text-xs text-text-muted font-medium">
              Secured by organizational access controls.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
