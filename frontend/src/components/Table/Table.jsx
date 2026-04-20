// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Data table component with sorting, pagination, and row interactions

import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const Table = ({ 
  columns, 
  data, 
  onRowClick, 
  emptyMessage = "No entries to display.",
  sortColumn,
  sortDirection,
  onSort,
  loading = false,
  error = null
}) => {
  return (
    <div className="w-full bg-bg-surface border border-border-default rounded-[10px] overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-bg-elevated border-b border-border-default h-[44px]">
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted select-none ${col.sortable ? 'cursor-pointer hover:text-text-secondary transition-colors duration-150' : ''}`}
                  onClick={() => col.sortable && onSort && onSort(col.accessor)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      sortColumn === col.accessor ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-accent" /> : <ArrowDown className="w-3 h-3 text-accent" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30 hover:opacity-50 transition-opacity" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={`skeleton-${i}`} className="h-[44px] border-b border-border-subtle">
                  {columns.map((col, j) => (
                    <td key={`skeleton-col-${j}`} className="px-4 py-3">
                      <div className="h-3 bg-bg-elevated rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
               <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="text-sm font-medium text-danger">Failed to load data</span>
                    <span className="text-xs text-text-muted">{error}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-16">
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="text-sm font-medium text-text-secondary">{emptyMessage.title || emptyMessage}</span>
                    {emptyMessage.hint && <span className="text-xs text-text-muted">{emptyMessage.hint}</span>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`
                    border-b border-border-subtle h-[44px]
                    transition-colors duration-100
                    ${rowIndex % 2 === 1 ? 'bg-[#13131C]/[0.015]' : 'bg-transparent'}
                    ${onRowClick ? 'hover:bg-bg-hover cursor-pointer' : 'hover:bg-bg-hover'}
                  `}
                  onClick={(e) => {
                    if (!e.target.closest('button')) {
                      onRowClick && onRowClick(row);
                    }
                  }}
                >
                  {columns.map((col, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-4 py-3 text-sm text-text-primary ${col.align === 'right' ? 'text-right' : 'text-left'}`}
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
