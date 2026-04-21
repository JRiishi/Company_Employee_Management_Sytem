// 🤖 AGENT CHAT — new file
import { useState, useCallback } from 'react';
import api from '../../services/api'; // existing Axios instance with auth headers

export default function useChatApi(user) {
  const [messages, setMessages] = useState([]);  // { id, role: 'user'|'agent', content, agent, timestamp, suggestions }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null); // currently selected agent

  // Determine which agents are available for this user role
  const availableAgents = useCallback(() => {
    const role = user?.role;
    const base = [
      { id: 'payroll',      label: 'Payroll',      icon: 'DollarSign', color: 'emerald',
        description: 'Salary, deductions, bonuses, payslips' },
      { id: 'performance',  label: 'Performance',  icon: 'TrendingUp',  color: 'blue',
        description: 'Scores, trends, peer comparison' },
      { id: 'task_manager', label: 'Tasks',        icon: 'CheckSquare', color: 'amber',
        description: 'Assignment, workload, estimates' },
    ];
    if (['manager', 'admin', 'hr'].includes(role)) {
      base.push({
        id: 'hr_decision', label: 'HR Decisions', icon: 'Users', color: 'violet',
        description: 'Promotions, risks, succession'
      });
    }
    return base;
  }, [user?.role]);

  const sendMessage = useCallback(async (messageText, agentId) => {
    if (!messageText.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      agent: agentId,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/agent/chat', {
        agent: agentId,
        message: messageText,
        emp_id: user?.id || user?.emp_id,
      });

      // The api.js interceptor returns response.data directly!
      const agentMsg = {
        id: Date.now() + 1,
        role: 'agent',
        content: response.response || "Agent responded but provided no text.",
        agent: agentId,
        timestamp: new Date(),
        suggestions: response.suggestions || [],
        structuredData: response.data || null,
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'agent',
        content: err.response?.data?.detail || 'Something went wrong. Please try again.',
        agent: agentId,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errMsg]);
      setError(errMsg.content);
    } finally {
      setLoading(false);
    }
  }, [loading, user]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    activeAgent,
    setActiveAgent,
    sendMessage,
    clearMessages,
    availableAgents,
  };
}