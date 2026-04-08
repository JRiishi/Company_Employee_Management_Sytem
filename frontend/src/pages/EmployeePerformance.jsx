import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Activity, TrendingUp, AlertCircle } from 'lucide-react';

// Components
import Card from '../components/Card/Card';
import StatsCard from '../components/StatsCard/StatsCard';
import PerformanceChart from '../components/PerformanceChart';
import InsightBox from '../components/InsightBox/InsightBox';

// Hooks
import { usePerformance } from '../hooks/usePerformance';

const SkeletonStats = () => (
  <Card className="p-5 flex flex-col justify-between min-h-[110px] border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-gray-200/50 rounded-md w-20 animate-pulse" />
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
    </div>
    <div className="flex items-baseline gap-2 mt-auto">
      <div className="h-8 bg-gray-200/50 rounded-lg w-16 animate-pulse" />
      <div className="h-4 bg-gray-100 rounded-md w-12 animate-pulse" />
    </div>
  </Card>
);

const EmployeePerformance = () => {
  const {
    performanceData,
    currentScore,
    avgScore,
    bestScore,
    improvement,
    improvementTrend,
    insightTitle,
    insightDescription,
    loading,
    error
  } = usePerformance();

  return (
    <motion.div 
      className="w-full flex justify-center flex-col gap-8 relative pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* SECTION 1 - Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left w-full border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Performance
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">Review your historical performance trends and AI-driven recommendations.</p>
        </div>
      </section>

      {/* SECTION 2 - Performance Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {loading ? (
          [1, 2, 3, 4].map(k => <SkeletonStats key={k} />)
        ) : (
          <>
            <StatsCard 
              title="Current Score" 
              value={currentScore} 
              icon={Star} 
            />
            <StatsCard 
              title="Average Score" 
              value={avgScore} 
              icon={Activity} 
            />
            <StatsCard 
              title="Best Score" 
              value={bestScore} 
              icon={Trophy} 
            />
            <StatsCard 
              title="Improvement" 
              value={improvement} 
              icon={TrendingUp} 
              trend={improvementTrend} 
            />
          </>
        )}
      </section>

      {/* SECTION 3 - AI Insight */}
      <section className="w-full">
        {loading ? (
          <Card className="w-full p-6 border-gray-100 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse shrink-0" />
            <div className="flex-1 w-full">
              <div className="h-4 bg-gray-200/50 rounded w-48 mb-3 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-full max-w-2xl animate-pulse" />
            </div>
          </Card>
        ) : !error ? (
          <InsightBox 
             title={insightTitle}
             insight={insightDescription}
             actionText="View Growth Plan"
             onAction={() => console.log('Action clicked')}
          />
        ) : null}
      </section>

      {/* SECTION 4 - Main Performance Chart */}
      <section className="w-full">
        {loading ? (
          <Card className="w-full h-[420px] flex flex-col justify-start border-gray-100 overflow-hidden bg-white px-6 py-5">
             <div className="flex justify-between items-center mb-6">
                <div className="h-5 bg-gray-200/50 rounded w-32 animate-pulse" />
                <div className="h-5 bg-gray-100 rounded w-8 animate-pulse" />
             </div>
             <div className="w-full flex-1 bg-gray-50/50 rounded-xl mb-4 border border-dashed border-gray-200 animate-pulse flex items-center justify-center">
             </div>
          </Card>
        ) : error ? (
          <Card className="w-full h-[420px] flex flex-col justify-center items-center border-red-100 bg-red-50/30 overflow-hidden px-6 py-5">
             <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
             <div className="text-[14px] font-medium text-red-600 tracking-tight">Unable to load performance data</div>
             <div className="text-[13px] text-red-500/80 mt-1">Please verify your connection and try again.</div>
          </Card>
        ) : (
          <PerformanceChart data={performanceData} />
        )}
      </section>

      {/* SECTION 5 - Performance Breakdown */}
      <section className="grid grid-cols-1 gap-8 w-full">
        <Card className="p-6 w-full">
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight mb-4">Core Strengths</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">Code Quality & Testing</p>
                <p className="text-[13px] text-gray-500 mt-0.5">Consistently maintains 95%+ coverage on critical services.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">System Architecture</p>
                <p className="text-[13px] text-gray-500 mt-0.5">Highly effective at organizing complex monoliths into decoupled modules.</p>
              </div>
            </li>
          </ul>
        </Card>

        <Card className="p-6 w-full">
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight mb-4">Growth Areas</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">Cross-Team Communication</p>
                <p className="text-[13px] text-gray-500 mt-0.5">Opportunity to increase visibility of technical decisions with product stakeholders.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">Mentorship</p>
                <p className="text-[13px] text-gray-500 mt-0.5">Consider leading more pairing sessions with junior developers.</p>
              </div>
            </li>
          </ul>
        </Card>
      </section>

    </motion.div>
  );
};
export default EmployeePerformance;
