// 🌌 UNIVERSE UI APPLIED — Logic unchanged. Visual layer only.
// Changes: Glass morphism effect with semi-transparent background and backdrop blur.

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
        border border-white/10
        rounded-[10px]
        overflow-hidden
        ${hoverable ? 'hover:border-white/20 transition-colors duration-150 cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: 'rgba(19, 19, 28, 0.70)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {header && (
        <div 
          className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between"
        >
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
        <div className="px-5 py-3 border-t border-white/[0.06] text-sm text-text-secondary">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
