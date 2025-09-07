'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '../hooks/LanguageProvider'
import { useTheme } from '../hooks/useTheme'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { 
  HomeIcon, 
  InformationCircleIcon, 
  BookOpenIcon, 
  MapPinIcon, 
  PhoneIcon,
  CogIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const GlobalNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { t, isRTL } = useLanguage()
  const { isDark } = useTheme()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Navigation items
  const navItems = [
    { href: '/', label: t('nav.home'), icon: HomeIcon },
    { href: '/about', label: t('nav.about'), icon: InformationCircleIcon },
    { href: '/menu', label: t('nav.menu'), icon: BookOpenIcon },
    { href: '/branches', label: t('nav.branches'), icon: MapPinIcon },
    { href: '/contact', label: t('nav.contact'), icon: PhoneIcon },
    { href: '/admin', label: t('nav.admin'), icon: CogIcon },
    { href: '/pos', label: t('nav.pos'), icon: ShoppingCartIcon }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-deep-50/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/90 dark:bg-deep-50/90 backdrop-blur-sm'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-sakura-50 to-accent-50 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌸</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold bg-gradient-to-r from-sakura-50 to-deep-50 dark:from-sakura-50 dark:to-white bg-clip-text text-transparent`}>
                {t('brand.name')}
              </span>
              <span className="text-xs text-accent-50 dark:text-accent-100">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-sakura-50 bg-sakura-50/10 border-b-2 border-sakura-50'
                      : 'text-deep-50 dark:text-white hover:text-sakura-50 hover:bg-sakura-50/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <LanguageSwitcher className="hidden sm:flex" showText={false} />
            <ThemeToggle className="hidden sm:flex" />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-deep-50 dark:text-white hover:text-sakura-50 hover:bg-sakura-50/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-sakura-50/20 dark:border-white/20">
            <div className="py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-sakura-50 bg-sakura-50/10 border-r-4 rtl:border-r-0 rtl:border-l-4 border-sakura-50'
                        : 'text-deep-50 dark:text-white hover:text-sakura-50 hover:bg-sakura-50/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-sakura-50/20 dark:border-white/20">
                <LanguageSwitcher showText={true} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default GlobalNavbar
