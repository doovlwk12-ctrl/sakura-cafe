'use client'

import React from 'react'
import { ThemeProvider } from '../hooks/useTheme'
import { LanguageProvider } from '../hooks/LanguageProvider'
import { AuthProvider } from './AuthProvider'
import { CartProvider } from '../hooks/useCart'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
