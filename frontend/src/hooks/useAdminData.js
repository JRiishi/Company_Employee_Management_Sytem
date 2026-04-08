import { useState, useEffect } from 'react';
import { fetchAdminData, createEmployeeAdmin } from '../services/api';

export const useAdminData = () => {
  const [data, setData] = useState({
    employees: [],
    stats: {},
    recommendations: [],
    auditLogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAdminData();
      setData(res);
    } catch (err) {
      console.error("Failed to load admin data", err);
      setError("Failed to load admin data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createUser = async (employeeData) => {
    try {
      const response = await createEmployeeAdmin(employeeData);
      await loadData(); // Refresh the list
      return { success: true, message: response.message };
    } catch (err) {
      console.error("Failed to create user", err);
      return { 
        success: false, 
        message: err.response?.data?.detail || "Failed to create employee" 
      };
    }
  };

  return { data, loading, error, refreshData: loadData, createUser };
};
