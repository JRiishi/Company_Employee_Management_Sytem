// � UNIVERSE UI APPLIED — Logic unchanged. Visual layer only.
// Changes: Glass morphism effect, dark theme table styling, improved row hover states.

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
    <div 
      className="w-full border border-white/10 rounded-[10px] overflow-hidden flex flex-col"
      style={{
        background: 'rgba(19, 19, 28, 0.70)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr 
              className="border-b border-white/[0.06] h-[44px]"
              style={{ background: 'rgba(255, 255, 255, 0.03)' }}
            >
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 select-none ${col.sortable ? 'cursor-pointer hover:text-gray-400 transition-colors duration-150' : ''}`}
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
                <tr key={`skeleton-${i}`} className="h-[44px] border-b border-white/[0.04]">
                  {columns.map((col, j) => (
                    <td key={`skeleton-col-${j}`} className="px-4 py-3">
                      <div 
                        className="h-3 rounded animate-pulse w-3/4"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      />
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
                    border-b border-white/[0.04] h-[44px]
                    transition-colors duration-100
                    hover:bg-white/[0.04]
                    ${onRowClick ? 'cursor-pointer' : ''}
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
