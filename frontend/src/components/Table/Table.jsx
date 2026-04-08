import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const Table = ({ 
  columns, 
  data, 
  onRowClick, 
  emptyMessage = "No assigned entries to display.",
  sortColumn,
  sortDirection,
  onSort,
  loading = false,
  error = null
}) => {
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden">
      <div className="overflow-x-auto w-full flex-grow">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-full">
          <thead>
            <tr className="bg-blue-50/60 uppercase text-xs sm:text-[13px] font-bold text-blue-900/80 tracking-wider h-14 border-b border-blue-100/60">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-4 sm:px-6 py-3 sm:py-4 ${col.sortable ? 'cursor-pointer hover:bg-blue-100/50 transition-colors duration-200 select-none' : ''}`}
                  onClick={() => col.sortable && onSort && onSort(col.accessor)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <span className="text-blue-400">
                        {sortColumn === col.accessor ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={`skeleton-${i}`} className="h-14 bg-white transition-colors duration-150">
                  {columns.map((col, j) => (
                    <td key={`skeleton-col-${j}`} className="px-6 py-3 border-r border-transparent">
                      <div className="h-4 bg-gray-100 rounded-md animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] w-[80%]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
               <tr className="h-[280px]">
                <td colSpan={columns.length} className="text-center align-middle">
                  <div className="inline-flex flex-col items-center justify-center text-gray-400">
                    <span className="text-[13px] font-medium text-red-600/80 mb-1">Failed to load data</span>
                    <span className="text-[12px]">{error}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr className="h-[280px]">
                <td colSpan={columns.length} className="text-center align-middle">
                  <div className="inline-flex flex-col items-center justify-center text-gray-400">
                    <span className="text-[13px] font-medium text-gray-600 mb-1">{emptyMessage.title || emptyMessage}</span>
                    {emptyMessage.hint && <span className="text-[12px]">{emptyMessage.hint}</span>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`
                    transition-all duration-200 h-14 sm:h-16 bg-white
                    ${onRowClick ? 'hover:bg-blue-50/40 cursor-pointer' : 'hover:bg-blue-50/20'}
                  `}
                  onClick={(e) => {
                    // Prevent row click if an action button inside is clicked
                    if (!e.target.closest('button')) {
                      onRowClick && onRowClick(row);
                    }
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base text-slate-700 whitespace-nowrap font-medium ${col.align === 'right' ? 'text-right tracking-tight' : 'text-left'}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Table;
