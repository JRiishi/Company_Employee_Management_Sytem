// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Dropdown select component for form inputs

import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ 
  options = [], 
  label,
  error,
  helper,
  className = '', 
  wrapperClassName = '',
  onChange,
  value,
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && (
        <label className="block text-xs font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full 
            bg-bg-elevated 
            border rounded-[7px]
            px-3 py-2 h-[38px] pr-8
            text-sm text-text-primary
            font-medium
            appearance-none
            transition-all duration-150
            focus:outline-none
            ${error ? 'border-danger/50 focus:ring-2 focus:ring-danger/20' : 
              'border-border-default focus:border-border-strong focus:ring-2 focus:ring-accent/20'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-text-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p className="text-xs text-danger mt-1">{error}</p>
      )}

      {helper && !error && (
        <p className="text-xs text-text-muted mt-1">{helper}</p>
      )}
    </div>
  );
};

export default Select;
