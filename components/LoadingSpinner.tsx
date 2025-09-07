'use client'

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-pink-200 border-t-rose-500',
    secondary: 'border-rose-200 border-t-pink-500',
    white: 'border-white/30 border-t-white'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${sizeClasses[size]} border-4 rounded-full animate-spin ${colorClasses[color]}`}
      ></div>
      {text && (
        <p className="mt-3 text-sm text-gray-600 text-center font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
