// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Grid of stat cards (KPI display)

import React from 'react';
import StatsCard from '../StatsCard/StatsCard';
import Card from '../Card/Card';
import { Target, CheckCircle, Clock, DollarSign } from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-bg-elevated border border-border-subtle rounded-[10px] p-5 h-[118px] animate-pulse">
    <div className="flex justify-between items-center w-full mb-4">
      <div className="h-3 w-1/3 bg-border-default rounded"></div>
      <div className="h-8 w-8 bg-border-default rounded-[6px]"></div>
    </div>
    <div className="flex items-baseline gap-2">
      <div className="h-6 w-16 bg-border-default rounded"></div>
      <div className="h-3 w-12 bg-border-subtle rounded"></div>
    </div>
  </div>
);

const StatsGrid = ({ stats, loading }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {loading ? (
        Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
      ) : (
        <>
          <StatsCard 
            title="Assignments Cleared" 
            value={stats?.tasksCompleted} 
            icon={CheckCircle} 
            trend="+4 active" 
          />
          <StatsCard 
            title="Pending Targets" 
            value={stats?.pendingTasks} 
            icon={Clock} 
          />
          <StatsCard 
            title="Evaluated Score" 
            value={stats?.performanceScore} 
            icon={Target} 
            trend={stats?.scoreTrend} 
          />
          <StatsCard 
            title="Cycle Base Salary" 
            value={stats?.salaryThisMonth} 
            icon={DollarSign} 
          />
        </>
      )}
    </section>
  );
};

export default StatsGrid;
