import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ 
  options = [], 
  className = '', 
  wrapperClassName = '',
  onChange,
  value,
  ...props 
}) => {
  return (
    <div className={`relative flex items-center w-full ${wrapperClassName}`}>
      <select
        value={value}
        onChange={onChange}
        className={`
          w-full bg-white border border-gray-200 rounded-lg 
          text-[13px] text-gray-900 font-medium
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
          transition-all duration-200
          appearance-none px-3 py-2 pr-8
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
      <div className="absolute right-3 pointer-events-none text-gray-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};
export default Select;
