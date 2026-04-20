// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Manager dashboard with team stats, performance chart, task assignment, and employee table.

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
  CheckCircle2,
  TrendingDown,
  Sparkles
} from 'lucide-react';

// Components
import StatsCard from '../components/StatsCard/StatsCard';
import PerformanceChart from '../components/PerformanceChart';
import Table from '../components/Table/Table';
import InsightBox from '../components/InsightBox/InsightBox';
import Card from '../components/Card/Card';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import Badge from '../components/Badge/Badge';
import { StatsGrid, WelcomeSection, ChartSection, TableSection, InsightSection } from '../components/Sections';

// Hooks
import { useManagerData } from '../hooks/useManagerData';

const teamColumns = [
  { header: 'Employee Name', accessor: 'name', sortable: true, render: (row) => (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-accent-subtle text-accent-text flex items-center justify-center text-xs font-semibold shrink-0">
        {row.name ? row.name.substring(0, 2).toUpperCase() : 'UI'}
      </div>
      <span className="font-medium text-text-primary">{row.name}</span>
    </div>
  )},
  { header: 'Role', accessor: 'role', sortable: true },
  { header: 'Performance Score', accessor: 'performance_score', sortable: true, render: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-text-primary">{row.performance_score?.toFixed(1) || '0.0'}/10</span>
        <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden shrink-0 border border-border-subtle">
          <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${((row.performance_score || 0) / 10) * 100}%` }} />
        </div>
      </div>
  )},
  { header: 'Active Tasks', accessor: 'active_tasks', sortable: true },
  { header: 'Status', accessor: 'status', sortable: true, render: (row) => {
     let variant = 'neutral';
     if (row.status === 'On Track') variant = 'success';
     if (row.status === 'At Risk') variant = 'danger';
     if (row.status === 'Needs Review') variant = 'warning';
     
     return <Badge variant={variant}>{row.status || 'Unknown'}</Badge>;
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
  const [assignmentFeedback, setAssignmentFeedback] = useState(null);

  const handleRowClick = (row) => {
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
      setTaskTitle('');
      setTaskDesc('');
      setTaskDeadline('');
      setSelectedEmp('');
      setTimeout(() => setAssignmentFeedback(null), 3000);
    } else {
      setAssignmentFeedback({ type: 'error', message: result.error || 'Failed to assign task' });
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <motion.div 
      className="w-full flex flex-col gap-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <WelcomeSection 
        title="Manager Dashboard" 
        subtitle="Overview of your team performance and workload."
        dateText={today}
      />

      {error ? (
        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-[10px] text-sm font-medium flex items-center gap-2 w-full">
          <AlertCircle className="w-4 h-4 text-danger" />
          {error}
        </div>
      ) : (
        <>
          <StatsGrid>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-[104px] skeleton"></div>
              ))
            ) : (
              <>
                <StatsCard title="Team Size" value={teamStats?.total_employees || 0} icon={Users} trend={{ value: '+2', isPositive: true }} />
                <StatsCard title="Avg Performance" value={teamStats?.avg_performance?.toFixed(1) || '0.0'} icon={TrendingUp} trend={{ value: '+0.4', isPositive: true }} />
                <StatsCard title="Active Tasks" value={teamStats?.active_tasks || 0} icon={ClipboardList} />
                <StatsCard title="Pending Approvals" value={teamStats?.pending_reviews || 0} icon={Clock} trend={{ value: 'Needs action', isPositive: false }} />
              </>
            )}
          </StatsGrid>

          {!loading && (
            <InsightBox 
              title="Manager Insight" 
              insight="2 employees show declining performance. Consider reviewing their workload and reassigning lower-priority tickets." 
              actionText="Review Workload"
              onAction={() => console.log("Action Triggered")}
              confidence={88}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-2">
              <ChartSection title="Team Performance Trend" subtitle="Average score over last 6 months">
                {loading ? (
                  <div className="h-[240px] skeleton w-full"></div>
                ) : (
                  <PerformanceChart data={performanceTrend || []} />
                )}
              </ChartSection>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <PlusCircle className="w-[18px] h-[18px] text-accent" />
                    Assign New Task
                  </h3>
                </div>
                <div className="p-5">
                  <AnimatePresence>
                    {assignmentFeedback && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mb-4 px-3 py-2 rounded-[7px] text-xs font-medium flex items-center gap-2 ${
                          assignmentFeedback.type === 'success' 
                            ? 'bg-success/15 text-success border border-success/20'
                            : 'bg-danger/15 text-danger border border-danger/20'
                        }`}
                      >
                        {assignmentFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {assignmentFeedback.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <form onSubmit={handleAssignTask} className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1.5 block">Assign To</label>
                      <div className="relative flex items-center w-full">
                        <div className="absolute left-3 text-text-muted pointer-events-none z-10">
                          <UserPlus className="w-[14px] h-[14px]" />
                        </div>
                        <select
                          value={selectedEmp}
                          onChange={(e) => setSelectedEmp(e.target.value)}
                          required
                          className="w-full bg-bg-elevated border border-border-default rounded-[7px] text-sm text-text-primary focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-accent/20 transition-all appearance-none pl-9 pr-3 py-2 h-[38px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="" disabled className="text-text-muted">Select Employee...</option>
                          {employees?.map(emp => (
                            <option key={emp.id} value={emp.id} className="text-text-primary bg-bg-elevated">{emp.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1.5 block">Title</label>
                      <Input 
                        icon={FileText} 
                        placeholder="Task overview..." 
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1.5 block">Description</label>
                      <textarea 
                        placeholder="Requirements..." 
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        className="w-full bg-bg-elevated border border-border-default rounded-[7px] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-strong focus:ring-2 focus:ring-accent/20 transition-all px-3 py-2 min-h-[60px] resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1.5 block">Deadline</label>
                      <Input 
                        type="date"
                        icon={Calendar} 
                        value={taskDeadline}
                        onChange={(e) => setTaskDeadline(e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full mt-2"
                      disabled={assigning}
                    >
                      {assigning ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Assigning...
                        </div>
                      ) : 'Assign Task'}
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>

          <TableSection title="Team Members" subtitle="Overview of direct reports">
            <Table 
              columns={teamColumns} 
              data={employees || []} 
              onRowClick={handleRowClick}
              loading={loading}
              emptyMessage="No team members found."
            />
          </TableSection>
        </>
      )}
    </motion.div>
  );
};

export default ManagerDashboard;
