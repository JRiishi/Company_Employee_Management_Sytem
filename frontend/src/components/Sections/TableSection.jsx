import React from 'react';
import Card from '../Card/Card';
import Table from '../Table/Table';
import Badge from '../Badge/Badge';

const TableSection = ({ tasks, loading }) => {
  const columns = [
    { header: 'Task Title', accessor: 'title' },
    { header: 'Deadline', accessor: 'deadline' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => {
        let variant = 'default';
        if (row.status === 'Completed') variant = 'success';
        if (row.status === 'In Progress') variant = 'warning';
        if (row.status === 'Pending') variant = 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    }
  ];

  return (
    <Card hoverable className="flex flex-col h-[420px] overflow-hidden !transition-all !duration-200">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Recent Tasks</h3>
        </div>
        <button className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer">
          View All
        </button>
      </div>
      
      <div className="flex-1 overflow-auto bg-white p-0">
        {loading ? (
          <div className="w-full bg-white border-t-0 border border-gray-100 overflow-hidden rounded-b-2xl h-full animate-pulse">
            <div className="bg-gray-50 h-11 border-b border-gray-100 w-full flex items-center px-6 gap-20">
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-14 flex items-center px-6 gap-20 w-full">
                  <div className="h-3 w-32 bg-gray-100 rounded"></div>
                  <div className="h-3 w-20 bg-gray-100 rounded"></div>
                  <div className="h-5 w-20 bg-gray-100 rounded-md"></div>
                </div>
              ))}
            </div>
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
