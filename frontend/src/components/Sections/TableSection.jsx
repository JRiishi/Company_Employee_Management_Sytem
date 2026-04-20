// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Reusable table section with header and data display

import React from 'react';
import Card from '../Card/Card';
import Table from '../Table/Table';
import Badge from '../Badge/Badge';

const TableSection = ({ tasks, loading, title = "Recent Tasks" }) => {
  const columns = [
    { header: 'Task Title', accessor: 'title' },
    { header: 'Deadline', accessor: 'deadline' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        let variant = 'neutral';
        if (row.status === 'Completed') variant = 'success';
        if (row.status === 'In Progress') variant = 'warning';
        if (row.status === 'Pending') variant = 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    }
  ];

  const SkeletonRow = () => (
    <div className="h-12 flex items-center px-5 border-b border-border-subtle gap-6">
      <div className="h-3 w-32 bg-border-default rounded"></div>
      <div className="h-3 w-20 bg-border-default rounded"></div>
      <div className="h-5 w-16 bg-border-default rounded"></div>
    </div>
  );

  return (
    <Card className="flex flex-col h-auto max-h-[420px] overflow-hidden">
      <div className="px-5 py-4 border-b border-border-subtle flex justify-between items-center flex-shrink-0">
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">{title}</h3>
        <button className="text-xs font-medium text-accent hover:text-accent-hover transition-colors duration-150 cursor-pointer">
          View All
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="divide-y divide-border-subtle">
            {[1, 2, 3, 4, 5].map(i => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={tasks || []} 
            emptyMessage="No tasks assigned."
          />
        )}
      </div>
    </Card>
  );
};

export default TableSection;
