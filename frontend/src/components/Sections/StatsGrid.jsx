import React from 'react';
import StatsCard from '../StatsCard/StatsCard';
import Card from '../Card/Card';
import { Target, CheckCircle, Clock, DollarSign } from 'lucide-react';

const SkeletonCard = () => (
  <Card className="p-5 h-[118px] animate-pulse flex flex-col justify-between">
    <div className="flex justify-between items-center w-full">
      <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
    </div>
    <div className="flex items-baseline gap-2">
      <div className="h-8 w-16 bg-gray-200 rounded"></div>
      <div className="h-3 w-12 bg-gray-100 rounded"></div>
    </div>
  </Card>
);

const StatsGrid = ({ stats, loading }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
      {loading ? Array(4).fill(0).map((_,i) => <SkeletonCard key={i} />) : (
        <>
          <StatsCard title="Assignments Cleared" value={stats?.tasksCompleted} icon={CheckCircle} trend="+4 active" />
          <StatsCard title="Pending Targets" value={stats?.pendingTasks} icon={Clock} />
          <StatsCard title="Evaluated Score" value={stats?.performanceScore} icon={Target} trend={stats?.scoreTrend} />
          <StatsCard title="Cycle Base Salary" value={stats?.salaryThisMonth} icon={DollarSign} />
        </>
      )}
    </section>
  );
};
export default StatsGrid;
