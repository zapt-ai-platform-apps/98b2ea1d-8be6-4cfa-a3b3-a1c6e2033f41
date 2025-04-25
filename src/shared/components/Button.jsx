import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-white text-primary border border-primary hover:bg-gray-50',
  danger: 'bg-danger text-white hover:bg-red-700',
  success: 'bg-success text-white hover:bg-green-700',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-5 py-2.5 text-lg'
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) => {
  const variantClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <button
      type={type}
      className={`
        rounded-md font-medium transition-colors duration-200
        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
        flex items-center justify-center
        ${variantClass} ${sizeClass} ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;