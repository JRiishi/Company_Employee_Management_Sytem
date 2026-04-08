import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import Card from '../components/Card/Card';

// Hooks
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect them away from the login page completely.
  if (user) {
     const rolePath = user.role === 'admin' ? '/admin/dashboard' : 
                      user.role === 'manager' ? '/manager/dashboard' : 
                      '/employee/dashboard';
     return <Navigate to={rolePath} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
       setError("Please enter both email and password.");
       return;
    }
    
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      // Navigate to correct dashboard seamlessly upon token storage
      if (loggedInUser.role === 'admin') navigate('/admin/dashboard');
      else if (loggedInUser.role === 'manager') navigate('/manager/dashboard');
      else navigate('/employee/dashboard');
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-gray-50 items-stretch">
      {/* 🔹 LEFT PANEL (Brand / Context) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-center px-12 xl:px-24">
        {/* Subtle Background Pattern matching System styling */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
               <Command className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Nexus HR</h1>
          </div>
          <p className="text-xl text-blue-100 font-medium leading-snug max-w-lg mb-6">
            AI-powered workforce intelligence.
          </p>
          <p className="text-[15px] text-blue-200/80 leading-relaxed max-w-md">
            Securely access your employee portal, manage organizational tasks, and evaluate analytical telemetry natively integrated with intelligent processing pipelines.
          </p>
        </motion.div>
      </div>

      {/* 🔹 RIGHT PANEL (Login Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-[400px] flex flex-col"
        >
           {/* Mobile Brand Title (Only shows on small screens when split view breaks down) */}
           <div className="flex lg:hidden items-center justify-center gap-3 mb-10 mt-[-40px]">
             <div className="w-10 h-10 bg-blue-600 rounded-lg shadow-sm flex items-center justify-center">
                 <Command className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-2xl font-bold tracking-tight text-gray-900">Nexus HR</h2>
           </div>

           <div className="mb-8 text-center sm:text-left">
             <h2 className="text-[26px] font-bold tracking-tight text-gray-900">Sign In</h2>
             <p className="text-[14px] text-gray-500 mt-2">Authenticate to access your workspace ecosystem.</p>
           </div>
           
           <Card className="p-8 w-full shadow-sm border-gray-100">
              <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-[13px] font-medium border border-red-100 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700 tracking-tight ml-1">Email Address</label>
                  <Input 
                    icon={Mail} 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[44px]"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between ml-1 mr-1">
                     <label className="text-[13px] font-semibold text-gray-700 tracking-tight">Password</label>
                     <a href="#" className="text-[12px] font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150">Forgot Password?</a>
                  </div>
                  <Input 
                    icon={Lock} 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[44px]"
                    required
                  />
                </div>

                <Button 
                   type="submit"
                   variant="primary" 
                   disabled={loading}
                   className="w-full mt-2 h-[48px] font-bold tracking-wider"
                >
                   {loading ? (
                     <div className="flex items-center gap-2">
                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Signing in...
                     </div>
                   ) : "Sign In"}
                </Button>
              </form>
           </Card>

           <div className="w-full text-center mt-6">
             <p className="text-[13px] text-gray-400 font-medium">Secured by strict organizational access policies.</p>
           </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
