'use client';

import React from 'react';
import { useLanguage } from '../hooks/LanguageProvider';

interface LanguageSwitcherProps {
  className?: string;
  showText?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  showText = true 
}) => {
  const { language, changeLanguage, isRTL, t } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 bg-sakura-50 text-white ${className}`}
      title={t('language.toggle')}
    >
      <span className="text-lg">
        {language === 'ar' ? '🇺🇸' : '🇸🇦'}
      </span>
      
      {showText && (
        <span className="font-medium text-sm">
          {language === 'ar' ? 'EN' : 'عربي'}
        </span>
      )}
      
      <div className="w-4 h-4">
        <svg 
          className="w-4 h-4 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </div>
    </button>
  );
};

export default LanguageSwitcher;
