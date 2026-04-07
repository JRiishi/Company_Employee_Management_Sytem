import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, TrendingDown, Wallet, Receipt, AlertCircle } from 'lucide-react';

// UI Components
import Card from '../components/Card/Card';
import StatsCard from '../components/StatsCard/StatsCard';
import Table from '../components/Table/Table';
import InsightBox from '../components/InsightBox/InsightBox';

// Hooks
import { useSalary } from '../hooks/useSalary';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const SkeletonStats = () => (
  <Card className="p-5 flex flex-col justify-between min-h-[110px] border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <div className="h-4 bg-gray-200/50 rounded-md w-20 animate-pulse" />
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
    </div>
    <div className="flex items-baseline gap-2 mt-auto">
      <div className="h-8 bg-gray-200/50 rounded-lg w-24 animate-pulse" />
    </div>
  </Card>
);

const EmployeeSalary = () => {
  const { salaryData, salaryHistory, loading, error } = useSalary();

  const columns = [
    { header: 'Month', accessor: 'month', sortable: false },
    { 
      header: 'Base Salary', 
      accessor: 'base_salary', 
      align: 'right',
      sortable: false,
      render: (row) => <span className="font-medium text-gray-900">{formatCurrency(row.base_salary)}</span>
    },
    { 
      header: 'Deductions', 
      accessor: 'deductions', 
      align: 'right',
      sortable: false,
      render: (row) => (
        <span className="text-red-500 font-medium">
          {row.deductions > 0 ? `-${formatCurrency(row.deductions)}` : formatCurrency(row.deductions)}
        </span>
      )
    },
    { 
      header: 'Net Salary', 
      accessor: 'net_salary',
      align: 'right',
      sortable: false,
      render: (row) => <span className="font-bold text-gray-900">{formatCurrency(row.net_salary)}</span>
    }
  ];

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
            Salary
          </h2>
          <p className="text-[14px] text-gray-500 mt-1">Monthly salary overview and history</p>
        </div>
      </section>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="w-full flex justify-center py-6">
          <Card className="max-w-md w-full flex flex-col justify-center items-center border-red-100 bg-red-50/30 overflow-hidden px-6 py-5">
             <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
             <div className="text-[14px] font-medium text-red-600 tracking-tight">{error}</div>
             <div className="text-[13px] text-red-500 mt-1">Please verify your connection</div>
          </Card>
        </div>
      )}

      {/* SECTION 2 - Summary Cards */}
      {!error && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {loading || !salaryData ? (
            [1, 2, 3].map(k => <SkeletonStats key={k} />)
          ) : (
            <>
              <StatsCard 
                title="Base Salary" 
                value={formatCurrency(salaryData.base_salary)} 
                icon={Banknote} 
              />
              <StatsCard 
                title="Deductions" 
                value={salaryData.deductions > 0 ? `-${formatCurrency(salaryData.deductions)}` : formatCurrency(salaryData.deductions)} 
                icon={TrendingDown} 
                trend="This month"
              />
              <StatsCard 
                title="Net Salary" 
                value={formatCurrency(salaryData.net_salary)} 
                icon={Wallet} 
              />
            </>
          )}
        </section>
      )}

      {/* SECTION 5 - Optional Insight */}
      {!error && !loading && salaryData && (
        <section className="w-full">
          <InsightBox 
            title="Salary Overview"
            insight={salaryData.deductions > 0 
              ? "Your salary reflects standard tax and leave deductions for this period."
              : "Your net salary was processed with no additional deductions this cycle."}
            actionText="View Breakdowns"
            onAction={() => console.log('View Actions')}
          />
        </section>
      )}

      {!error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
          {/* SECTION 3 - Salary Breakdown */}
          <section className="w-full lg:col-span-1">
            <Card className="flex flex-col w-full transition-all duration-200 border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Receipt className="w-5 h-5 text-gray-400" />
                <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Earnings Breakdown</h3>
              </div>
              
              <div className="flex flex-col text-[14px]">
                {loading || !salaryData ? (
                  <div className="animate-pulse flex flex-col w-full">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="h-4 bg-gray-200/50 rounded w-24" />
                      <div className="h-4 bg-gray-200/50 rounded w-20" />
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="h-4 bg-gray-200/50 rounded w-32" />
                      <div className="h-4 bg-gray-200/50 rounded w-16" />
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-2">
                      <div className="h-5 bg-gray-200/50 rounded w-20" />
                      <div className="h-6 bg-gray-200/50 rounded w-24" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Base Salary</span>
                      <span className="text-gray-900 font-semibold text-right">{formatCurrency(salaryData.base_salary)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Total Deductions</span>
                      <span className="text-red-500 font-semibold text-right">
                        {salaryData.deductions > 0 ? `-${formatCurrency(salaryData.deductions)}` : formatCurrency(salaryData.deductions)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-2">
                      <span className="text-gray-900 font-bold tracking-tight">Net Salary</span>
                      <span className="text-xl font-bold text-gray-900 tracking-tight text-right">{formatCurrency(salaryData.net_salary)}</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </section>

          {/* SECTION 4 - Salary History Table */}
          <section className="w-full lg:col-span-2">
            <Card className="flex flex-col w-full transition-all duration-200 border border-gray-200 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
                <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight">Salary History</h3>
              </div>
              <div className="w-full bg-white rounded-b-2xl overflow-hidden">
                  <Table 
                    columns={columns} 
                    data={salaryHistory} 
                    loading={loading}
                    emptyMessage="No salary history available."
                    onRowClick={(row) => console.log('View Payslip', row.month)}
                  />
              </div>
            </Card>
          </section>
        </div>
      )}
    </motion.div>
  );
};
export default EmployeeSalary;
