import { useState, useEffect, useCallback } from 'react';
import { fetchManagerData, assignTask as assignManagerTask } from '../services/api';

export const useManagerData = () => {
  const [teamStats, setTeamStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [performanceTrend, setPerformanceTrend] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchManagerData();
      
      setTeamStats(data.teamStats);
      setEmployees(data.employees);
      setPerformanceTrend(data.performanceTrend);
      
    } catch (err) {
      console.error('Error fetching manager data:', err);
      setError('Failed to securely load your team scope. Network connection failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const assignTask = async (taskData) => {
    try {
      await assignManagerTask(taskData);
      await fetchAllData();
      return { success: true };
    } catch (err) {
      console.error('Error assigning task:', err);
      return { success: false, error: err.response?.data?.message || err.message || 'Failed to assign team task' };
    }
  };

  return {
    teamStats,
    employees,
    performanceTrend,
    loading,
    error, 
    assignTask,
    refreshData: fetchAllData
  };
};
