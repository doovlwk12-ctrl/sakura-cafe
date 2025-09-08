'use client'

import React from 'react'
import { ThemeProvider } from '../hooks/useTheme'
import { LanguageProvider } from '../hooks/LanguageProvider'
import { AuthProvider } from './AuthProvider'
import { CartProvider } from '../hooks/useCart'
import { RealTimeDataProvider } from '../hooks/useRealTimeData'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <RealTimeDataProvider>
              {children}
            </RealTimeDataProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
