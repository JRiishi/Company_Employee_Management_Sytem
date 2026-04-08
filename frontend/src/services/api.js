import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const bypassUrls = ['/auth/login', '/auth/set-password', '/auth/refresh'];
    
    if (error.response && error.response.status === 401 && !originalRequest._retry && !bypassUrls.includes(originalRequest.url)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('nexus_refresh_token');
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const data = res.data.data;
        localStorage.setItem('nexus_token', data.token);
        localStorage.setItem('nexus_refresh_token', data.refresh_token);
        
        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
        originalRequest.headers.Authorization = 'Bearer ' + data.token;
        
        processQueue(null, data.token);
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        sessionStorage.clear();
        window.location.hash = '#/login';
        window.location.reload();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
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

export default api;

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
