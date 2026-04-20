// ✅ UI REDESIGN APPLIED — Logic unchanged. Only CSS classes and JSX structure modified.
// Original functionality: Reusable card wrapper component for content containers

import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  header,
  subtitle,
  footer,
  hoverable = false, 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        w-full
        bg-bg-surface 
        border border-border-default 
        rounded-[10px]
        overflow-hidden
        ${hoverable ? 'hover:border-border-strong transition-colors duration-150 cursor-pointer' : ''}
        ${className}
      `}
    >
      {header && (
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{header}</h3>
            {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      
      <div className="p-5">
        {children}
      </div>

      {footer && (
        <div className="px-5 py-3 border-t border-border-subtle text-sm text-text-secondary">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
