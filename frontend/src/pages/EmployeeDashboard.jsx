// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Employee home dashboard with stats, charts, tasks, leaves

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

// Hooks
import { useDashboardData } from '../hooks/useDashboardData';

// Sections
import WelcomeSection from '../components/Sections/WelcomeSection';
import InsightSection from '../components/Sections/InsightSection';
import StatsGrid from '../components/Sections/StatsGrid';
import ChartSection from '../components/Sections/ChartSection';
import TableSection from '../components/Sections/TableSection';

const EmployeeDashboard = () => {
  const { dashboardData, tasks, performanceData, loading, error } = useDashboardData();

  // Map API flat response to the structured format components expect
  const formattedStats = dashboardData ? {
    tasksCompleted: dashboardData.tasks_completed,
    pendingTasks: dashboardData.pending_tasks,
    performanceScore: dashboardData.performance_score,
    salaryThisMonth: dashboardData.salary_this_month 
      ? `$${dashboardData.salary_this_month.toLocaleString()}` 
      : 'N/A'
  } : null;

  return (
    <>
      <motion.div 
        className="w-full flex justify-center flex-col gap-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-[10px] text-xs font-medium flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <WelcomeSection userName="Employee" loading={loading} />
        
        <InsightSection 
          insight={dashboardData?.insight} 
          loading={loading}
          confidence={dashboardData?.confidence}
        />
        
        <StatsGrid stats={formattedStats} loading={loading} />
        
        <div className="flex flex-col gap-6 w-full">
          <ChartSection performanceData={performanceData} loading={loading} />
          <TableSection tasks={tasks} loading={loading} title="Recent Tasks" />
        </div>
        
      </motion.div>
    </>
  );
};

export default EmployeeDashboard;
