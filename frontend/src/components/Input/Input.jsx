import React from 'react';

const Input = ({ 
  icon: Icon, 
  className = '', 
  wrapperClassName = '',
  onChange,
  value,
  ...props 
}) => {
  return (
    <div className={`relative flex items-center w-full ${wrapperClassName}`}>
      {Icon && (
        <div className="absolute left-3 text-gray-400 pointer-events-none">
          <Icon className="w-[15px] h-[15px]" />
        </div>
      )}
      <input
        value={value}
        onChange={onChange}
        className={`
          w-full bg-white border border-gray-200 rounded-lg 
          text-[13px] text-gray-900 placeholder-gray-400
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
          transition-all duration-200
          ${Icon ? 'pl-9 pr-3' : 'px-3'} py-2
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
export default Input;
