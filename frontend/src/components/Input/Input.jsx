// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Reusable form input component with label and validation states

import React from 'react';
import { AlertCircle } from 'lucide-react';

const Input = ({ 
  icon: Icon, 
  label,
  error,
  success,
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
        {Icon && (
          <div className="absolute left-3 text-text-muted pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        <input
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full 
            bg-bg-elevated 
            border rounded-[7px]
            px-3 py-2 h-[38px]
            text-sm text-text-primary 
            placeholder-text-muted
            transition-all duration-150
            focus:outline-none
            ${Icon ? 'pl-9' : ''}
            ${error ? 'border-danger/50 focus:ring-2 focus:ring-danger/20' : 
              success ? 'border-success/50 focus:ring-2 focus:ring-success/20' :
              'border-border-default focus:border-border-strong focus:ring-2 focus:ring-accent/20'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1 text-xs text-danger">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      {helper && !error && (
        <p className="text-xs text-text-muted mt-1">{helper}</p>
      )}
    </div>
  );
};

export default Input;
