import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setPassword } from '../services/api';
import { AlertCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPwd] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing authentication token');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      const res = await setPassword(token, password);
      if (res.success) {
        setSuccess('Account activated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid or expired link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-inter bg-[#0B0F17] text-text-primary p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-[#1A1A26] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
               <Lock className="text-blue-400" size={24} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Set Your Password
            </h2>
            <p className="text-text-primary mt-2">Secure your account to begin</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3 text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center space-x-3 text-emerald-400">
              <span className="text-sm font-medium">{success} Redirecting...</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-[#0D0D14] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary placeholder-gray-600 transition-all font-inter"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPwd(e.target.value)}
                disabled={Boolean(!token) || Boolean(success)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-[#0D0D14] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary placeholder-gray-600 transition-all font-inter"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={Boolean(!token) || Boolean(success)}
              />
            </div>

            <button
              type="submit"
              disabled={Boolean(!token) || loading || Boolean(success)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all transform active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Activating...' : 'Set Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SetPassword;
