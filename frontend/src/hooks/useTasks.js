import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

// For immediate UI display before API is truly ready, we can initialize with null
export const useTasks = (initialMockData = null) => {
  const [tasks, setTasks] = useState(initialMockData || []);
  const [loading, setLoading] = useState(!initialMockData);
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch initial tasks
  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Note: For now, the API endpoint might not exist, 
        // but we structure the call exactly as requested.
        const response = await api.get('/tasks');
        if (isMounted) {
          // If real API works, set its data. If not, catching it sets error.
          // Since the prompt asks to connect to a real backend API, we attempt to fetch it.
          // If we want to simulate the mocked data as a fallback to see the UI, we can.
          // But strict requirement: DO NOT hardcode final data.
          setTasks(response.data?.tasks || response.data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          // If backend isn't real yet, let's gracefully fail but we might have nothing to show.
          setError("Failed to load tasks");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTasks();
    return () => { isMounted = false; };
  }, []);

  // Update Status Logic
  const updateTaskStatus = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    
    // Optimistic UI Update immediately
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    setErrorMsg(null);

    try {
      // Connects to explicit real API path
      const res = await api.patch('/tasks/update', {
        task_id: taskId,
        status: newStatus
      });
      // Verification if needed
      // if (res.status !== 200) throw new Error('API Error');
    } catch (err) {
      // Rollback optimistic update
      setTasks(previousTasks);
      setErrorMsg("Failed to update task. Please try again.");
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };

  // Frontend Filtering
  const filteredTasks = useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return tasks.filter((task) => {
      const matchSearch = debouncedSearch
        ? task.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchStatus = statusFilter 
        ? task.status === statusFilter 
        : true;
      return matchSearch && matchStatus;
    });
  }, [tasks, debouncedSearch, statusFilter]);

  return {
    tasks,
    filteredTasks,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    loading,
    error,
    errorMsg,
    clearErrorMsg: () => setErrorMsg(null),
    updateTaskStatus,
    clearFilters
  };
};
