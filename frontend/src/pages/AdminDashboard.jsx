import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Activity, Settings, UserPlus, AlertCircle, CheckCircle, Trash2, Eye, MoreVertical, Loader } from 'lucide-react';
import { useAdminData } from '../hooks/useAdminData';
import Card from '../components/Card/Card';
import api from '../services/api';

const AdminDashboard = () => {
  const { data, loading, error, createUser } = useAdminData();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showFireConfirm, setShowFireConfirm] = useState(false);
  const [employeeToFire, setEmployeeToFire] = useState(null);
  const [firingLoading, setFiringLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'employee', department: '' });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  // Fetch all employees with details
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await api.get('/admin/employees');
      if (response.success) {
        setEmployees(response.data || []);
        setFilteredEmployees(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setEmployeesLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  // Fetch employee details
  const viewEmployeeDetails = async (empId) => {
    try {
      const response = await api.get(`/admin/employee/${empId}`);
      if (response.success) {
        setSelectedEmployee(response.data);
      }
    } catch (err) {
      console.error('Error fetching employee details:', err);
    }
  };

  // Fire employee
  const handleFireEmployee = async () => {
    if (!employeeToFire) return;
    
    try {
      setFiringLoading(true);
      const response = await api.post('/admin/fire-employee', {
        emp_id: employeeToFire.emp_id,
        reason: 'Terminated by admin'
      });
      
      if (response.success) {
        setSubmitStatus({ type: 'success', message: `${employeeToFire.name} has been terminated.` });
        setShowFireConfirm(false);
        setEmployeeToFire(null);
        // Refresh employee list
        fetchEmployees();
      } else {
        setSubmitStatus({ type: 'error', message: response.message || 'Failed to terminate employee' });
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: 'Error terminating employee' });
    } finally {
      setFiringLoading(false);
    }
  };

  // Create new user
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
      setSubmitStatus({ type: 'success', message: 'User created successfully!' });
      setForm({ name: '', email: '', role: 'employee', department: '' });
      fetchEmployees();
    } else {
      setSubmitStatus({ type: 'error', message: result.message });
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="p-8 text-center text-gray-400 font-inter">Loading admin data...</div>;
  if (error) return <div className="p-8 text-center text-red-400 font-inter">{error}</div>;

  return (
    <div className="p-8 font-inter max-w-7xl mx-auto space-y-8 animate-fade-in text-gray-100">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent mb-2">
            System Administration
          </h1>
          <p className="text-gray-400">Manage employees, view details, and handle HR decisions</p>
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
              <p className="text-sm text-gray-400">Total Employees</p>
              <h3 className="text-2xl font-bold">{employees.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="hover:border-green-500/50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Activity className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Employees</p>
              <h3 className="text-2xl font-bold">{employees.filter(e => e.status === 'active').length}</h3>
            </div>
          </div>
        </Card>

        <Card className="hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <AlertCircle className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Inactive</p>
              <h3 className="text-2xl font-bold">{employees.filter(e => e.status === 'inactive').length}</h3>
            </div>
          </div>
        </Card>

        <Card className="hover:border-purple-500/50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Shield className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Admin Access</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Messages */}
      {submitStatus.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg flex items-center space-x-3 ${
            submitStatus.type === 'success'
              ? 'bg-green-500/10 border border-green-500/50 text-green-400'
              : 'bg-red-500/10 border border-red-500/50 text-red-400'
          }`}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{submitStatus.message}</span>
        </motion.div>
      )}


      {/* Fire Confirmation Modal */}
      {showFireConfirm && employeeToFire && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFireConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-xl border border-red-500/50 p-6 max-w-md w-full space-y-4"
          >
            <h3 className="text-xl font-bold text-red-400 flex items-center space-x-2">
              <AlertCircle size={24} />
              <span>Confirm Termination</span>
            </h3>
            <p className="text-gray-300">
              Are you sure you want to terminate <strong>{employeeToFire.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFireConfirm(false);
                  setEmployeeToFire(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleFireEmployee}
                disabled={firingLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 rounded-lg transition-colors font-semibold text-white flex items-center justify-center gap-2"
              >
                {firingLoading ? <Loader className="animate-spin" size={18} /> : <Trash2 size={18} />}
                {firingLoading ? 'Terminating...' : 'Confirm Termination'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
