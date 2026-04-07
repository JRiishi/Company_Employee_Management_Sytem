import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, FilterX, AlertCircle } from 'lucide-react';

// Hooks
import { useTasks } from '../hooks/useTasks';

// UI Components
import Card from '../components/Card/Card';
import Table from '../components/Table/Table';
import Badge from '../components/Badge/Badge';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Select from '../components/Select/Select';

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
];

const EmployeeTasks = () => {
  const {
    filteredTasks,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    loading,
    error,
    errorMsg,
    clearErrorMsg,
    updateTaskStatus,
    clearFilters
  } = useTasks();

  const columns = [
    { header: 'Task Title', accessor: 'title', sortable: true },
    { 
      header: 'Status', 
      accessor: 'status', 
      sortable: true,
      render: (row) => {
        let variant = 'default';
        if (row.status === 'Completed') variant = 'success';
        if (row.status === 'In Progress') variant = 'warning';
        if (row.status === 'Pending') variant = 'pending';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    { header: 'Deadline', accessor: 'deadline', sortable: true },
    { 
      header: 'Actions', 
      accessor: 'actions',
      align: 'right',
      render: (row) => (
        <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status !== 'Completed' && (
            <>
              <Select 
                wrapperClassName="w-[130px]"
                className="!text-[12px] !py-[6px] !pl-3 !pr-8 min-h-0 h-8 hover:bg-gray-50 cursor-pointer"
                value={row.status} 
                options={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'In Progress', value: 'In Progress' },
                  { label: 'Completed', value: 'Completed' }
                ]}
                onChange={(e) => updateTaskStatus(row.id, e.target.value)}
              />
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => updateTaskStatus(row.id, 'Completed')}
              >
                Mark Complete
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm">Details</Button>
        </div>
      )
    }
  ];

  return (
    <>
      <motion.div 
        className="w-full flex justify-center flex-col gap-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Action Error Message Display (temporary optimist failure) */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-red-50 text-red-700 px-4 py-3 rounded-xl shadow-sm text-[13px] font-medium border border-red-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={clearErrorMsg} className="text-red-500 hover:text-red-700 transition-colors duration-150">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 1 - Page Header */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left w-full">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              My Tasks
            </h2>
            <p className="text-[14px] text-gray-500 mt-1">Manage your active operations and deliverables.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" icon={Plus}>
              New Task
            </Button>
          </div>
        </section>

        {/* SECTION 2 - Filters Bar */}
        <section className="flex flex-col sm:flex-row items-center gap-3 w-full bg-transparent">
          <div className="w-full sm:w-[300px]">
            <Input 
              icon={Search} 
              placeholder="Search task title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <Select 
              options={STATUS_OPTIONS} 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
            />
          </div>
          
          <AnimatePresence>
            {(searchQuery || statusFilter) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full sm:w-auto sm:ml-auto"
              >
                <Button variant="ghost" size="sm" icon={FilterX} onClick={clearFilters}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SECTION 3 - Tasks Table Container */}
        <section className="w-full">
          <Card className="flex flex-col overflow-hidden w-full transition-all duration-200 border border-gray-200/60 shadow-sm">
            <div className="w-full bg-white">
                <Table 
                  columns={columns} 
                  data={filteredTasks} 
                  loading={loading}
                  error={error}
                  emptyMessage={{
                    title: "No tasks found",
                    hint: (searchQuery || statusFilter) ? "Try adjusting your filters to see more results." : ""
                  }}
                  onRowClick={(row) => console.log('View Row', row.id)}
                />
            </div>
          </Card>
        </section>

      </motion.div>
    </>
  );
};
export default EmployeeTasks;
