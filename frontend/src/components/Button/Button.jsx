// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Reusable button component with multiple variants and sizes

import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  disabled = false,
  loading = false,
  onClick,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-accent hover:bg-accent-hover text-white focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-base';
      case 'secondary':
        return 'bg-transparent border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-bg-elevated';
      case 'danger':
        return 'bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 hover:border-danger/50';
      case 'success':
        return 'bg-success/10 border border-success/30 text-success hover:bg-success/20 hover:border-success/50';
      case 'warning':
        return 'bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20 hover:border-warning/50';
      case 'ghost':
        return 'bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary';
      default:
        return 'bg-accent hover:bg-accent-hover text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs h-[30px]';
      case 'md':
        return 'px-4 py-2 text-sm h-[36px]';
      case 'lg':
        return 'px-5 py-2.5 text-sm h-[42px]';
      case 'icon':
        return 'p-2 h-[32px] w-[32px]';
      default:
        return 'px-4 py-2 text-sm h-[36px]';
    }
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-[7px]
        transition-all duration-150 
        focus:outline-none
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
