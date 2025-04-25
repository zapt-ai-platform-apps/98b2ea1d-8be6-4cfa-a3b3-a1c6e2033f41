import React from 'react';

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4'
};

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div className={`${sizeClass} border-gray-300 border-t-primary rounded-full animate-spin ${className}`}></div>
  );
};

export default LoadingSpinner;