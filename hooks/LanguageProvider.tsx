'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { t, getCurrentLanguage, setLanguage } from '../src/i18n'

export type Language = 'ar' | 'en'

interface LanguageContextType {
  language: Language
  changeLanguage: (newLanguage: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = getCurrentLanguage() as Language
    setLanguageState(savedLanguage)
    setLanguage(savedLanguage)
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setLanguage(newLanguage)
    
    // Apply RTL/LTR and language to document
    document.documentElement.lang = newLanguage
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr'
  }

  const isRTL = language === 'ar'

  const contextValue: LanguageContextType = {
    language,
    changeLanguage,
    t: (key: string) => t(key, language),
    isRTL
  }

  if (!mounted) {
    return null // نتأكد أن المكون ما يطلع شي قبل التحميل
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
