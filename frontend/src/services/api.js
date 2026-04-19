import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Pass auth errors through for login endpoints to handle
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

export const fetchAdminData = async () => {
  const [employees, stats, auditLogs, recommendations] = await Promise.all([
    api.get('/admin/employees'),
    api.get('/admin/stats'),
    api.get('/admin/audit'),
    api.get('/hr/recommendations')
  ]);
  
  return {
    employees: employees.data || [],
    stats: stats.data || {},
    auditLogs: auditLogs.data || [],
    recommendations: recommendations.data || []
  };
};

export const createEmployeeAdmin = async (empData) => {
  return await api.post('/admin/create-user', empData);
};

export const setPassword = async (token, password) => {
  return await api.post('/auth/set-password', { token, password });
};

export const fetchDashboard = async (empId) => {
  return await api.get(`/employee/${empId}/dashboard`);
};

export const fetchManagerData = async () => {
  const [stats, employees, performanceTrend] = await Promise.all([
    api.get('/manager/team'),
    api.get('/manager/employees'),
    api.get('/manager/performance'),
  ]);
  return {
    teamStats: stats.data,
    employees: employees.data,
    performanceTrend: performanceTrend.data,
  };
};

export const assignTask = async (taskData) => {
  return await api.post('/tasks/assign', taskData);
};

export const fetchUserData = async () => {
  return await api.get('/user/me');
};

export const updateProfile = async (userData) => {
  return await api.put('/user/update-profile', userData);
};

export const changePassword = async (passwordData) => {
  return await api.post('/auth/change-password', passwordData);
};

export const logoutUserAPI = async () => {
  return await api.post('/auth/logout');
};

export default api;
