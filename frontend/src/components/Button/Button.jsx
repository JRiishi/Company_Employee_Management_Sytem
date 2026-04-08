import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  disabled = false,
  onClick,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 border border-transparent';
      case 'secondary':
        return 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm hover:text-blue-800';
      case 'ghost':
        return 'bg-transparent text-blue-500 hover:bg-blue-50 hover:text-blue-700 border border-transparent';
      case 'danger':
        return 'bg-white text-red-600 hover:bg-red-50 border border-red-200 shadow-sm hover:border-red-300';
      default:
        return 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-[13px]';
      case 'md':
        return 'px-3 py-2 sm:px-5 sm:py-2.5 text-[13px] sm:text-[14px]';
      case 'lg':
        return 'px-4 py-2.5 sm:px-6 sm:py-3 text-[14px] sm:text-[15px]';
      case 'icon':
        return 'p-1.5 sm:p-2';
      default:
        return 'px-3 py-2 sm:px-5 sm:py-2.5 text-[13px] sm:text-[14px]';
    }
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-1.5 sm:gap-2 font-semibold rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none scale-100' : 'cursor-pointer active:scale-[0.98]'}
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' || size === 'icon' ? 'w-3 h-3 sm:w-3.5 sm:h-3.5' : 'w-4 h-4 sm:w-4.5 sm:h-4.5'} />}
      {children}
    </button>
  );
};
export default Button;
