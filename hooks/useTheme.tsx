'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const [isDark, setIsDark] = useState(true) // Default to dark mode
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get theme from localStorage or default to dark mode
    const savedTheme = localStorage.getItem('sakura-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      // Default to dark mode if no saved preference or if user prefers dark
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
    
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('sakura-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('sakura-theme', 'light')
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ display: 'none' }}>{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}