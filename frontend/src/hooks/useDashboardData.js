import { useState, useEffect } from 'react';
import api from '../services/api';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dashRes, tasksRes, perfRes] = await Promise.all([
          api.get('/employee/dashboard'),
          api.get('/tasks/recent'),
          api.get('/performance/history'),
        ]);

        // Vite SPA fallback returns HTML as a string for unhandled routes during dev.
        // We throw a manual error to gracefully trigger the UI's disconnected state.
        if (typeof dashRes.data === 'string' || typeof tasksRes.data === 'string') {
          throw new Error('Backend disconnected (received HTML SPA fallback)');
        }

        setDashboardData(dashRes.data);
        setTasks(tasksRes.data);
        setPerformanceData(perfRes.data);
      } catch (err) {
        console.error("API Fetch Error:", err.message || err);
        setError("Unable to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { dashboardData, tasks, performanceData, loading, error };
};
