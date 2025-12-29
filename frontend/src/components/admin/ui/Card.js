import React from 'react';

const Card = ({ children, title, actions, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
