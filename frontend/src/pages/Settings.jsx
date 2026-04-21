// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/Card/Card';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';
import { fetchUserData, updateProfile, changePassword } from '../services/api';

const Settings = () => {
  const { user, login } = useAuth(); // login might not be needed unless we update token, but we have setUser in AuthContext? Wait, we can't setUser easily. But fetchUserData returns it.
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({ name: '', email: '', department: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text: '' }

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchUserData();
      if(res.success && res.data) {
        setProfileData({
          name: res.data.name || '',
          email: res.data.email || '',
          department: res.data.department || ''
        });
      }
    } catch(err) {
      setFeedback({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ name: profileData.name, department: profileData.department });
      if(res.success) {
        showFeedback('success', 'Profile updated successfully.');
        // Local state is updated via loadData or response
        if (res.data) {
          setProfileData(prev => ({...prev, name: res.data.name, department: res.data.department}));
          // Update localStorage
          const savedUser = JSON.parse(localStorage.getItem('nexus_user') || '{}');
          const updatedUser = { ...savedUser, name: res.data.name, department: res.data.department };
          localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      showFeedback('error', err.response?.data?.detail || err.message || 'Failed to update profile.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if(passwordData.new_password !== passwordData.confirm_password) {
      return showFeedback('error', 'New passwords do not match.');
    }
    if(passwordData.new_password.length < 8) {
      return showFeedback('error', 'Password must be at least 8 characters long.');
    }

    try {
      const res = await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      if(res.success) {
        showFeedback('success', 'Password changed successfully.');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (err) {
       showFeedback('error', err.response?.data?.detail || err.message || 'Failed to change password.');
    }
  };

  return (
    <motion.div 
      className="w-full flex justify-center flex-col gap-6 relative max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <section className="mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Settings</h2>
        <p className="text-[14px] text-text-primary mt-1">Manage your account preferences and security.</p>
      </section>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`px-4 py-3 rounded-xl  text-[13px] font-medium flex items-center gap-2 ${feedback.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}
          >
            {feedback.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Tabs sidebar */}
        <Card className="w-full md:w-64 p-2 flex flex-col gap-1 shrink-0">
          <button 
            className={`text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-text-primary hover:'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={`text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${activeTab === 'password' ? 'bg-blue-50 text-blue-700' : 'text-text-primary hover:'}`}
            onClick={() => setActiveTab('password')}
          >
            Security
          </button>
        </Card>

        {/* Tab Content */}
        <div className="flex-1 w-full">
          {activeTab === 'profile' && (
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Profile Information</h3>
              {loading ? (
                 <div className="animate-pulse space-y-4">
                   <div className="h-10 bg-[#1A1A26] rounded w-full"></div>
                   <div className="h-10 bg-[#1A1A26] rounded w-full"></div>
                 </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-text-primary">Full Name</label>
                    <Input 
                      icon={User} 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-text-primary">Email Address</label>
                    <Input 
                      icon={Mail} 
                      value={profileData.email} 
                      disabled 
                      className=" text-text-primary cursor-not-allowed" 
                    />
                    <span className="text-[11px] text-text-primary ml-1">Contact your administrator to change your email.</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-text-primary">Department</label>
                    <Input 
                      icon={Briefcase} 
                      value={profileData.department} 
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})} 
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" className="h-10 px-6">
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {activeTab === 'password' && (
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-text-primary">Current Password</label>
                  <Input 
                    type="password"
                    icon={Lock} 
                    value={passwordData.current_password} 
                    onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})} 
                    required 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-text-primary">New Password</label>
                  <Input 
                    type="password"
                    icon={Lock} 
                    value={passwordData.new_password} 
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} 
                    required 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-text-primary">Confirm New Password</label>
                  <Input 
                    type="password"
                    icon={Lock} 
                    value={passwordData.confirm_password} 
                    onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})} 
                    required 
                  />
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <Button type="submit" variant="primary" className="h-10 px-6">
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
