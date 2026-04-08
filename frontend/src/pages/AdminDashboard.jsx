import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, Settings, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAdminData } from '../hooks/useAdminData';

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-xl border border-gray-700 p-6 ${className}`}>
    {children}
  </div>
);

const AdminDashboard = () => {
  const { data, loading, error, createUser } = useAdminData();
  const [form, setForm] = useState({ name: '', email: '', role: 'employee', department: '' });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) return <div className="p-8 text-center text-gray-400 font-inter">Loading admin data...</div>;
  if (error) return <div className="p-8 text-center text-red-400 font-inter">{error}</div>;

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    if (!form.name || !form.email || !form.department) {
       setSubmitStatus({ type: 'error', message: 'All fields are required.' });
       setIsSubmitting(false);
       return;
    }

    const result = await createUser(form);
    
    if (result.success) {
      setSubmitStatus({ type: 'success', message: 'Invite sent successfully!' });
      setForm({ name: '', email: '', role: 'employee', department: '' });
    } else {
      setSubmitStatus({ type: 'error', message: result.message });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="p-8 font-inter max-w-7xl mx-auto space-y-8 animate-fade-in text-gray-100">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent mb-2">
            System Administration
          </h1>
          <p className="text-gray-400">Manage users, security, and global settings</p>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700">
            <Settings size={18} className="text-blue-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-blue-500/50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold">{data.stats?.total_users || 0}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Creation */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <div className="flex items-center space-x-2 mb-6">
              <UserPlus className="text-blue-400" />
              <h2 className="text-xl font-semibold">Create Employee</h2>
            </div>
            
            {submitStatus.message && (
              <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 text-sm ${
                submitStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {submitStatus.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-100"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-100"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-100"
                  placeholder="Engineering"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-100 appearance-none"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Invite'}
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: User Management Table */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="text-blue-400" />
                <h2 className="text-xl font-semibold">User Directory</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700 text-sm text-gray-400">
                    <th className="pb-3 px-4 font-medium">Name</th>
                    <th className="pb-3 px-4 font-medium">Role</th>
                    <th className="pb-3 px-4 font-medium">Department</th>
                    <th className="pb-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.employees?.map((emp, i) => (
                    <motion.tr 
                      key={emp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-gray-700/50 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4 flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex flex-col items-center justify-center text-blue-400 font-medium">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{emp.name}</div>
                          <div className="text-sm text-gray-500">{emp.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          emp.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          emp.role === 'manager' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {emp.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">{emp.department}</td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                          Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
