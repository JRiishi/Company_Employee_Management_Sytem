import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Clock, 
  PlusCircle,
  FileText,
  Calendar,
  UserPlus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Components
import StatsCard from '../components/StatsCard/StatsCard';
import PerformanceChart from '../components/PerformanceChart';
import Table from '../components/Table/Table';
import InsightBox from '../components/InsightBox/InsightBox';
import Card from '../components/Card/Card';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

// Hooks
import { useManagerData } from '../hooks/useManagerData';

const teamColumns = [
  { header: 'Employee Name', accessor: 'name', sortable: true },
  { header: 'Role', accessor: 'role', sortable: true },
  { header: 'Performance Score', accessor: 'performance_score', sortable: true, render: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-900">{row.performance_score?.toFixed(1) || '0.0'}/10</span>
        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${((row.performance_score || 0) / 10) * 100}%` }} />
        </div>
      </div>
  )},
  { header: 'Active Tasks', accessor: 'active_tasks', sortable: true },
  { header: 'Status', accessor: 'status', sortable: true, render: (row) => {
     let colorClass = 'bg-gray-100 text-gray-700';
     if (row.status === 'On Track') colorClass = 'bg-emerald-100 text-emerald-700';
     if (row.status === 'At Risk') colorClass = 'bg-red-100 text-red-700';
     if (row.status === 'Needs Review') colorClass = 'bg-amber-100 text-amber-700';
     
     return (
       <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${colorClass}`}>
         {row.status || 'Unknown'}
       </span>
     );
  }},
];

const ManagerDashboard = () => {
  const { 
    teamStats, 
    employees, 
    performanceTrend, 
    loading, 
    error, 
    assignTask 
  } = useManagerData();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const handleRowClick = (row) => {
    // Preparing to open employee detail
    console.log("Opening details for employee:", row.id);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedEmp || !taskTitle) return;
    
    setAssigning(true);
    setAssignmentFeedback(null);

    const result = await assignTask({
      assigned_to: selectedEmp,
      title: taskTitle,
      description: taskDesc,
      deadline: taskDeadline
    });

    setAssigning(false);

    if (result.success) {
      setAssignmentFeedback({ type: 'success', message: 'Task assigned successfully' });
      // Clear form
      setTaskTitle('');
      setTaskDesc('');
      setTaskDeadline('');
      setSelectedEmp('');
      
      // Auto dismiss feedback after 3s
      setTimeout(() => setAssignmentFeedback(null), 3000);
    } else {
      setAssignmentFeedback({ type: 'error', message: result.error || 'Failed to assign task' });
    }
  };

  return (
    <motion.div 
      className="w-full flex justify-center flex-col gap-6 relative max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 🔹 SECTION 1 — Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left w-full block relative z-0 mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Manager Dashboard
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">Overview of your team performance and workload</p>
        </div>
      </section>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm text-[13px] font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          {error}
        </div>
      ) : (
        <>
          {/* 🔹 SECTION 2 — TEAM STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="p-5 h-[104px]">
                  <div className="animate-pulse flex flex-col justify-between h-full">
                    <div className="flex justify-between items-center mb-2">
                       <div className="h-4 bg-gray-200 rounded w-24"></div>
                       <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </Card>
              ))
            ) : (
              <>
                <StatsCard title="Total Employees" value={teamStats?.total_employees || 0} icon={Users} />
                <StatsCard title="Active Tasks" value={teamStats?.active_tasks || 0} icon={ClipboardList} />
                <StatsCard title="Avg Team Performance" value={teamStats?.avg_performance?.toFixed(1) || '0.0'} icon={TrendingUp} />
                <StatsCard title="Pending Reviews" value={teamStats?.pending_reviews || 0} icon={Clock} />
              </>
            )}
          </div>

          {/* 🔹 SECTION 6 — AI RECOMMENDATIONS */}
          {!loading && (
             <InsightBox 
               title="Manager Insight" 
               insight="2 employees show declining performance. Consider reviewing their workload and reassigning lower-priority tickets." 
               actionText="Review Workload"
               onAction={() => console.log("Action Triggered")}
             />
          )}

          {/* MID SECTION: Chart + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full h-[420px]">
            
            {/* 🔹 SECTION 3 — TEAM PERFORMANCE OVERVIEW */}
            <div className="lg:col-span-2 flex flex-col h-full">
              {loading ? (
                <Card className="flex flex-col h-full w-full overflow-hidden p-6 relative">
                  <div className="animate-pulse h-5 bg-gray-200 rounded w-32 mb-6"></div>
                  <div className="animate-pulse w-full h-full bg-gray-100 rounded-lg"></div>
                </Card>
              ) : (
                <PerformanceChart data={performanceTrend || []} />
              )}
            </div>

            {/* 🔹 SECTION 5 — TASK ASSIGNMENT PANEL */}
            <div className="lg:col-span-1 flex flex-col h-full">
              <Card className="p-6 flex flex-col h-full overflow-hidden relative">
                <div className="border-b border-gray-100 pb-4 mb-4 flex items-center justify-between shrink-0">
                  <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-blue-600" />
                    Assign New Task
                  </h3>
                </div>

                <AnimatePresence>
                  {assignmentFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-4 px-3 py-2 rounded-lg text-[12px] font-medium flex items-center gap-2 ${
                        assignmentFeedback.type === 'success' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}
                    >
                      {assignmentFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {assignmentFeedback.message}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleAssignTask} className="flex flex-col gap-3 flex-grow justify-between min-h-0">
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <label className="text-[12px] font-semibold text-gray-700 tracking-tight pl-1">Assign To</label>
                    <div className="relative flex items-center w-full">
                      <div className="absolute left-3 text-gray-400 pointer-events-none z-10">
                        <UserPlus className="w-[14px] h-[14px]" />
                      </div>
                      <select
                        value={selectedEmp}
                        onChange={(e) => setSelectedEmp(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg text-[13px] text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none pl-9 pr-3 py-2 h-[38px] disabled:bg-gray-50"
                        
                      >
                        <option value="" disabled>Select Employee...</option>
                        {employees?.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <label className="text-[12px] font-semibold text-gray-700 tracking-tight pl-1">Title</label>
                    <Input 
                      icon={FileText} 
                      placeholder="Task overview..." 
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="h-[38px]"
                      required
                      
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-grow min-h-[60px]">
                    <label className="text-[12px] font-semibold text-gray-700 tracking-tight pl-1">Description</label>
                    <textarea 
                      placeholder="Requirements..." 
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 px-3 py-2 flex-grow resize-none disabled:bg-gray-50"
                      required
                      
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <label className="text-[12px] font-semibold text-gray-700 tracking-tight pl-1">Deadline</label>
                    <Input 
                      type="date"
                      icon={Calendar} 
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="h-[38px]"
                      required
                      
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full mt-1 h-[40px] font-bold tracking-wider shrink-0"
                    
                  >
                    {assigning ? 'Assigning...' : 'Assign Task'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>

          {/* 🔹 SECTION 4 — TEAM TABLE */}
          <section className="flex flex-col w-full">
            <h3 className="text-[16px] font-semibold text-gray-900 tracking-tight mb-3 pl-1">Team Overview</h3>
            <Card className="overflow-hidden">
              <Table 
                columns={teamColumns} 
                data={employees || []} 
                onRowClick={handleRowClick}
                loading={loading}
                emptyMessage="No team members found."
              />
            </Card>
          </section>
        </>
      )}
    </motion.div>
  );
};

export default ManagerDashboard;
