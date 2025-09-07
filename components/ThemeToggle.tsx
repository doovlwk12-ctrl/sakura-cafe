'use client';

import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/LanguageProvider';

interface ThemeToggleProps {
  className?: string;
  showText?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showText = true 
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
        isDark 
          ? 'bg-gradient-to-r from-deep-50 to-accent-50 text-white' 
          : 'bg-gradient-to-r from-sakura-50 to-accent-50 text-white'
      } ${className}`}
      title={t('theme.toggle')}
    >
      <span className="text-lg">
        {isDark ? '☀️' : '🌙'}
      </span>
      
      {showText && (
        <span className="font-medium text-sm">
          {isDark ? t('theme.light') : t('theme.dark')}
        </span>
      )}
      
      <div className="w-4 h-4">
        <svg 
          className="w-4 h-4 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isDark ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          )}
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggle;
