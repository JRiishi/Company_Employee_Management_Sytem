// 🌑 DARK THEME FIX APPLIED — Only color/background/border classes changed.
// All logic, functions, props, and API calls are 100% unchanged.

// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Reusable badge/status tag component for labeling

import React from 'react';

const Badge = ({ variant = 'default', children, className = '', showDot = true }) => {
  const getVariantStyles = () => {
    switch (variant.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-success/15 text-success border border-success/20';
      case 'in_progress':
      case 'in progress':
      case 'active':
        return 'bg-info/15 text-info border border-info/20';
      case 'error':
      case 'danger':
        return 'bg-danger/15 text-danger border border-danger/20';
      case 'warning':
      case 'pending':
        return 'bg-warning/15 text-warning border border-warning/20';
      case 'accent':
        return 'bg-accent/15 text-accent-text border border-accent/20';
      case 'neutral':
      case 'default':
      default:
        return 'bg-[#13131C]/5 text-text-muted border border-border-default';
    }
  };

  return (
    <span className={`
      inline-flex items-center gap-1 
      px-2 py-0.5 
      rounded-[5px] 
      text-[11px] font-semibold
      letter-spacing-wide
      ${getVariantStyles()} 
      ${className}
    `}>
      {showDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  );
};

export default Badge;
