import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled, className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
