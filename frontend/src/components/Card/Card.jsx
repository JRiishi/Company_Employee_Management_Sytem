import React from 'react';

const Card = ({ children, className = '', hoverable = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-gray-200 
        shadow-sm font-sans
        ${hoverable ? 'hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 ease-out cursor-pointer pointer-events-auto' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
export default Card;
