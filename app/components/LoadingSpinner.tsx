import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'var(--scratch-blue)',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div 
        className="absolute w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-700"
        style={{ borderTopColor: color }}
        role="status"
        aria-label="加载中"
      >
        <div className="w-full h-full animate-spin" />
      </div>
      <style jsx>{`
        @keyframes custom-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: custom-spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
} 