import { useState, useEffect, useCallback } from 'react';
import { fetchDashboard } from '../services/api';

export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem('nexus_user');
      if (!userStr) throw new Error("Not logged in");
      const user = JSON.parse(userStr);
      const empId = user.id;

      const res = await fetchDashboard(empId);
      if (!res.success) throw new Error(res.message);
      
      const payload = res.data;
      
      setDashboardData({
        tasks_completed: payload?.tasks?.completed || 0,
        pending_tasks: payload?.tasks?.pending || 0,
        performance_score: payload?.performance?.score || 0,
        salary_this_month: payload?.salary?.current || 0,
        insight: payload?.insights || ''
      });

      setTasks(payload?.tasks?.tasks || []);
      setPerformanceData(payload?.performance?.history || []);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message || 'Failed to securely load your dashboard context. Please login again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { dashboardData, tasks, performanceData, loading, error, refreshData: fetchAllData };
};
