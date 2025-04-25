import React from 'react';

const Card = ({ children, className = '', title, footer, noPadding = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-100">
          {typeof title === 'string' ? (
            <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;