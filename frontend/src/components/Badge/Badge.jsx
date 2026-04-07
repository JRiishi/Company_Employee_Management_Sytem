import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const getVariantStyles = () => {
    switch (variant.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'in_progress':
      case 'in progress':
      case 'warning':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
      case 'error':
      case 'danger':
        return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
      case 'pending':
      case 'default':
      default:
        return 'bg-gray-50 text-gray-600 ring-1 ring-gray-900/10';
    }
  };

  // Strictly NO animations or transitions on badges
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide ${getVariantStyles()} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
