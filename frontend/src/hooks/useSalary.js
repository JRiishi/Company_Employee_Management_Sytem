import { useState, useEffect } from 'react';
import api from '../services/api';

export const useSalary = () => {
  const [salaryData, setSalaryData] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSalary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulating the API calls with a delay since backend might not exist yet
        let activeData = null;
        let activeHistory = [];

        try {
          const [currentRes, historyRes] = await Promise.all([
            api.get('/salary/current'),
            api.get('/salary/history')
          ]);
          activeData = currentRes.data;
          activeHistory = historyRes.data || [];
        } catch (e) {
             console.warn('API /salary endpoints unavailable, falling back to simulated data.');
             await new Promise(resolve => setTimeout(resolve, 800));
             activeData = {
               base_salary: 120000,
               deductions: 22500,
               net_salary: 97500
             };
             activeHistory = [
               { id: 1, month: "April 2026", base_salary: 120000, deductions: 22500, net_salary: 97500 },
               { id: 2, month: "March 2026", base_salary: 120000, deductions: 18500, net_salary: 101500 },
               { id: 3, month: "February 2026", base_salary: 120000, deductions: 18500, net_salary: 101500 },
               { id: 4, month: "January 2026", base_salary: 110000, deductions: 16500, net_salary: 93500 },
               { id: 5, month: "December 2025", base_salary: 110000, deductions: 16500, net_salary: 93500 },
             ];
        }

        if (isMounted) {
          setSalaryData(activeData);
          setSalaryHistory(Array.isArray(activeHistory) ? activeHistory : []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load salary data");
          setSalaryData(null);
          setSalaryHistory([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSalary();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    salaryData,
    salaryHistory,
    loading,
    error
  };
};
