'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  InformationCircleIcon, 
  BookOpenIcon, 
  MapPinIcon, 
  PhoneIcon,
  CogIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  LanguageIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '../hooks/LanguageProvider'
import { useAuth } from './AuthProvider'
import { useTheme } from '../hooks/useTheme'
import { useCart } from '../hooks/useCart'
import LoginModal from './auth/LoginModal'

const SimpleNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { language, changeLanguage, t, isRTL } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const { totalItems } = useCart()
  const pathname = usePathname()

  // Handle scroll effect and active section detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      
      // Detect active section
      const sections = ['home', 'about', 'menu', 'branches', 'contact']
      const scrollPosition = window.scrollY + 150
      
      let currentSection = 'home'
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentSection = section
            break
          }
        }
      }
      
      setActiveSection(currentSection)
    }
    
    window.addEventListener('scroll', handleScroll)
    // Call once to set initial state after a delay
    setTimeout(handleScroll, 500)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showAccountMenu && !target.closest('.account-menu-container')) {
        setShowAccountMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showAccountMenu])


  // Main navigation items (center section)
  const mainNavItems = [
    { href: '#home', section: 'home', label: t('nav.home'), icon: HomeIcon },
    { href: '#menu', section: 'menu', label: t('nav.menu'), icon: BookOpenIcon },
    { href: '#branches', section: 'branches', label: t('nav.branches'), icon: MapPinIcon },
    { href: '#about', section: 'about', label: t('nav.about'), icon: InformationCircleIcon },
    { href: '#contact', section: 'contact', label: t('nav.contact'), icon: PhoneIcon }
  ]

  // Admin/System items (for mobile menu only)
  const systemNavItems = [
    { href: '/admin', label: t('nav.admin'), icon: CogIcon },
    { href: '/pos', label: t('nav.pos'), icon: ShoppingCartIcon }
  ]

  const allNavItems = [...mainNavItems, ...systemNavItems]

  const isActive = (href: string, section?: string) => {
    // For hash links (sections), check if it's the active section
    if (section) {
      return activeSection === section
    }
    // For regular routes
    if (href === '/') {
      return pathname === '/'
    }
    // For specific pages
    if (href === '/admin') {
      return pathname.startsWith('/admin')
    }
    if (href === '/pos') {
      return pathname.startsWith('/pos')
    }
    return pathname.startsWith(href)
  }

  // Handle navigation clicks
  const handleNavClick = (e: React.MouseEvent, href: string, section?: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      // For hash links, scroll to section
      const element = document.getElementById(href.substring(1))
      if (element) {
        // Wait a bit for the page to be ready
        setTimeout(() => {
          const offsetTop = element.offsetTop - 100 // Account for navbar height + padding
          window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
          })
        }, 100)
      } else {
        console.warn(`Element with id "${href.substring(1)}" not found`)
      }
    }
    // For regular links, Next.js Link will handle navigation
  }



  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-deep-50/95 backdrop-blur-md shadow-lg dark:shadow-black/20' 
          : 'bg-white/90 dark:bg-deep-50/90 backdrop-blur-sm'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center h-16 md:h-18 lg:h-20">
          
          {/* 3. الأيقونات والميزات المتقدمة - أقصى اليسار */}
          <div className="flex items-center space-x-3 space-x-reverse order-1">
            {/* أيقونات الإجراءات */}
            <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
              {/* أيقونة سلة التسوق */}
              <Link 
                href="/cart"
                className="navbar-icon-button flex items-center justify-center w-8 h-8 rounded-lg bg-deep-50 dark:bg-gray-700 text-white hover:bg-sakura-50 dark:hover:bg-sakura-50 transition-all duration-300 hover:scale-105 shadow-md relative z-50"
                title={t('navbar.shoppingCart')}
              >
                <ShoppingCartIcon className="w-4 h-4 relative z-10" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* أيقونة البحث */}
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="navbar-icon-button flex items-center justify-center w-8 h-8 rounded-lg bg-deep-50 dark:bg-gray-700 text-white hover:bg-sakura-50 dark:hover:bg-sakura-50 transition-all duration-300 hover:scale-105 shadow-md relative z-10"
                title={t('navbar.search')}
              >
                <MagnifyingGlassIcon className="w-4 h-4 relative z-10" />
              </button>

              {/* أيقونة الحساب */}
              <div className="relative account-menu-container">
                <button 
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className={`navbar-icon-button flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-md relative z-10 ${
                    showAccountMenu || isAuthenticated
                      ? 'bg-sakura-50 text-white ring-2 ring-sakura-50/50'
                      : 'bg-deep-50 dark:bg-gray-700 text-white hover:bg-sakura-50 dark:hover:bg-sakura-50'
                  }`}
                  title={isAuthenticated ? `${t('navbar.welcome')} ${user?.username || t('navbar.user')}` : t('navbar.account')}
                >
                  <UserIcon className="w-4 h-4 relative z-10" />
                </button>

                {/* قائمة الحساب المنسدلة */}
                {showAccountMenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 overflow-hidden z-50">
                    {isAuthenticated ? (
                      <>
                        {/* معلومات المستخدم */}
                        <div className="px-4 py-4 bg-gradient-to-r from-sakura-50/10 to-deep-50/10 border-b border-gray-200 dark:border-gray-600">
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-900 dark:text-white font-arabic mb-1">
                              {t('navbar.welcome')}، {user?.fullName || user?.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic">
                              {user?.role === 'customer' ? t('navbar.premiumMember') : user?.role}
                            </p>
                            {user?.role === 'customer' && user?.loyaltyPoints && (
                              <div className="mt-2 inline-flex items-center bg-sakura-50/20 px-3 py-1 rounded-full">
                                <span className="text-xs text-sakura-50 font-arabic font-medium">
                                  ⭐ {user.loyaltyPoints} {t('navbar.rewardPoints')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* خيارات العميل */}
                        {user?.role === 'customer' && (
                          <div className="py-2">
                            <Link 
                              href="/account/profile"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-arabic"
                              onClick={() => setShowAccountMenu(false)}
                            >
                              <UserIcon className="w-4 h-4 ml-3 text-gray-400" />
                              {t('navbar.profile')}
                            </Link>
                            <Link 
                              href="/account/orders"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-arabic"
                              onClick={() => setShowAccountMenu(false)}
                            >
                              <ShoppingCartIcon className="w-4 h-4 ml-3 text-gray-400" />
                              {t('navbar.myOrders')}
                            </Link>
                  <Link
                              href="/account/rewards"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-arabic"
                              onClick={() => setShowAccountMenu(false)}
                            >
                              <span className="w-4 h-4 ml-3 text-sakura-50 text-sm">⭐</span>
                              {t('navbar.rewardsProgram')}
                  </Link>
                          </div>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-600 p-2">
                          <button 
                            onClick={() => {
                              logout()
                              setShowAccountMenu(false)
                            }}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-arabic"
                          >
                            <XMarkIcon className="w-4 h-4 ml-2" />
                            {t('navbar.logout')}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4">
                        <div className="text-center mb-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-white font-arabic mb-2">
                            {t('navbar.welcomeToSakura')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic leading-relaxed">
                            {t('navbar.loginBenefits')}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <button 
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-sakura-50 to-deep-50 text-white rounded-lg text-sm font-arabic font-medium hover:shadow-lg transition-all duration-300"
                            onClick={() => {
                              setShowAccountMenu(false)
                              setShowLoginModal(true)
                            }}
                          >
                            {t('navbar.login')}
                          </button>
                          <button 
                            className="w-full px-4 py-2.5 border-2 border-sakura-50 text-sakura-50 rounded-lg text-sm font-arabic font-medium hover:bg-sakura-50/10 transition-colors"
                            onClick={() => {
                              setShowAccountMenu(false)
                              window.location.href = '/auth/register'
                            }}
                          >
                            {t('navbar.createAccount')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="hidden sm:flex items-center space-x-2 space-x-reverse">
              {/* تبديل اللغة */}
              <button
                onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 bg-deep-50 dark:bg-gray-700 text-white hover:bg-sakura-50 dark:hover:bg-sakura-50 shadow-md text-xs"
                title={language === 'ar' ? t('navbar.switchToEnglish') : t('navbar.switchToArabic')}
              >
                <LanguageIcon className="w-3.5 h-3.5" />
                <span className="font-medium font-arabic">
                  {language === 'ar' ? 'EN' : 'عربي'}
                </span>
              </button>

              {/* تبديل الوضع */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 bg-deep-50 dark:bg-gray-700 text-white hover:bg-sakura-50 dark:hover:bg-sakura-50 shadow-md text-xs"
                title={isDark ? t('navbar.switchToLight') : t('navbar.switchToDark')}
              >
                {isDark ? (
                  <SunIcon className="w-3.5 h-3.5" />
                ) : (
                  <MoonIcon className="w-3.5 h-3.5" />
                )}
                <span className="font-medium font-arabic">
                  {isDark ? t('navbar.lightMode') : t('navbar.darkMode')}
                </span>
              </button>
            </div>
              
            {/* زر القائمة المحمولة */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-deep-50 text-white hover:bg-sakura-50 hover:scale-105 transition-all duration-300 shadow-md"
              >
                {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5" />
                ) : (
                <Bars3Icon className="w-5 h-5" />
                )}
              </button>
            </div>

          {/* 2. روابط التنقل الرئيسية - المنتصف */}
          <div className="hidden lg:flex items-center space-x-6 space-x-reverse flex-1 justify-center order-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.section)}
                  className={`navbar-link-hover group flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isActive(item.href, item.section)
                      ? 'text-sakura-50 bg-sakura-50/10 dark:bg-sakura-50/20 shadow-md border-b-2 border-sakura-50'
                      : 'text-deep-50 dark:text-gray-200 hover:text-sakura-50 hover:bg-sakura-50/5 dark:hover:bg-sakura-50/10'
                  }`}
                >
                  <span className="font-medium text-sm lg:text-base font-arabic">{item.label}</span>
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              )
            })}
          </div>

          {/* 1. الشعار والعلامة التجارية - أقصى اليمين دائماً */}
          <div className="order-3 logo-fixed-right">
            <Link href="/" className="flex items-center space-x-3 space-x-reverse group">
              {/* الشعار المحسن */}
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border-3 border-sakura-50/50 shadow-xl group-hover:shadow-2xl logo-glow transition-all duration-300 flex-shrink-0 bg-white/90">
                <img 
                  src="/images/logo+next+too-13-1920w.png" 
                  alt="Sakura Cafe Logo" 
                  className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-500 filter brightness-110 contrast-110"
                  onError={(e) => {
                    e.currentTarget.src = '/images/logo.png';
                    e.currentTarget.alt = 'Sakura Cafe Logo';
                  }}
                  loading="eager"
                />
              </div>
              
              {/* النص بجانب الشعار - دائماً بالعربية */}
            <div className="flex flex-col items-end text-right">
              <span className="navbar-brand-glow text-base md:text-lg lg:text-xl font-bold text-deep-50 dark:text-white font-arabic drop-shadow-sm whitespace-nowrap group-hover:text-sakura-50 transition-colors duration-300">
                {t('brand.name')}
              </span>
              <span className="text-xs md:text-sm text-sakura-50 dark:text-sakura-200 font-arabic drop-shadow-sm whitespace-nowrap opacity-90">
                {t('brand.tagline')}
              </span>
              </div>
            </Link>
          </div>
            </div>
            
        {/* Search Bar */}
        {showSearch && (
          <div className="border-t border-sakura-50/20 dark:border-gray-600/20 bg-white/95 dark:bg-deep-50/95 backdrop-blur-md p-4">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('navbar.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-sakura-50 focus:ring-2 focus:ring-sakura-50/20 outline-none transition-all duration-300 font-arabic text-right"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <button
                  onClick={() => {
                    setShowSearch(false)
                    setSearchQuery('')
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              {searchQuery && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center font-arabic">
                  {t('navbar.searchingFor')}: "{searchQuery}"
                </div>
              )}
            </div>
        </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-sakura-50/20 dark:border-gray-600/20 bg-white/95 dark:bg-deep-50/95 backdrop-blur-md">
            <div className="py-3 space-y-1 max-h-96 overflow-y-auto">
              {/* Main Navigation Items */}
              {allNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.href, (item as any).section)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center space-x-3 space-x-reverse px-4 py-3 mx-2 rounded-lg transition-all duration-300 ${
                      isActive(item.href, (item as any).section)
                        ? 'text-white bg-sakura-50 shadow-md'
                        : 'text-deep-50 dark:text-gray-200 hover:text-sakura-50 hover:bg-sakura-50/10 dark:hover:bg-sakura-50/20'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm font-arabic">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Action Buttons */}
              <div className="px-4 pt-4 border-t border-sakura-50/20 dark:border-gray-600/20 mt-3">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* سلة التسوق */}
                  <Link 
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-300 bg-deep-50 dark:bg-gray-700 text-white hover:bg-sakura-50 dark:hover:bg-sakura-50 text-sm relative z-50"
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                    <span className="font-medium font-arabic">{t('navbar.cart')}</span>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  
                  {/* الحساب */}
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-sakura-50 text-white text-sm">
                        <UserIcon className="w-4 h-4" />
                        <span className="font-medium font-arabic">
                          {user?.fullName || t('navbar.account')}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          logout()
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-300 bg-red-500 text-white hover:bg-red-600 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium font-arabic">
                          {t('navbar.logout')}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-300 bg-deep-50 dark:bg-gray-700 text-white hover:bg-sakura-50 dark:hover:bg-sakura-50 text-sm"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span className="font-medium font-arabic">
                          {t('navbar.login')}
                        </span>
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-300 border border-sakura-50 text-sakura-50 hover:bg-sakura-50 hover:text-white text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className="font-medium font-arabic">
                          {t('navbar.register')}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Language and Theme Controls */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg transition-all duration-300 bg-deep-50 text-white hover:bg-sakura-50 text-sm"
                  >
                    <LanguageIcon className="w-4 h-4" />
                    <span className="font-medium font-arabic">
                      {language === 'ar' ? 'EN' : 'عربي'}
                    </span>
                  </button>
                  
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg transition-all duration-300 bg-deep-50 text-white hover:bg-sakura-50 text-sm"
                  >
                    {isDark ? (
                      <SunIcon className="w-4 h-4" />
                    ) : (
                      <MoonIcon className="w-4 h-4" />
                    )}
                    <span className="font-medium font-arabic">
                      {isDark ? t('navbar.lightMode') : t('navbar.darkMode')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        userType="customer"
      />

    </nav>
  )
}

export default SimpleNavbar
