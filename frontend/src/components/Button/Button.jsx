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
        return 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border border-transparent';
      case 'secondary':
        return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:text-gray-900';
      case 'ghost':
        return 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-transparent';
      case 'danger':
        return 'bg-white text-red-600 hover:bg-red-50 border border-red-200 shadow-sm hover:border-red-300';
      default:
        return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-[12px]';
      case 'md':
        return 'px-4 py-2 text-[13px]';
      case 'lg':
        return 'px-5 py-2.5 text-[14px]';
      case 'icon':
        return 'p-1.5';
      default:
        return 'px-4 py-2 text-[13px]';
    }
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' || size === 'icon' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
};
export default Button;
