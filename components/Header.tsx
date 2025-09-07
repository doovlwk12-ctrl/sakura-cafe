'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaGift, FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import Image from 'next/image'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // حالة تسجيل الدخول

  const menuItems = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'من نحن', href: '#about' },
    { name: 'قائمة الطعام', href: '/menu' },
    { name: 'أفرعنا', href: '#branches' },
    { name: 'تواصل معنا', href: '#contact' },
    { name: 'الإدارة', href: '/admin' },
    { name: 'نقطة البيع', href: '/pos' },
  ]

  const authItems = [
    { name: 'تسجيل جديد', href: '#register', icon: <FaUserPlus />, showWhen: !isLoggedIn },
    { name: 'تسجيل دخول', href: '#login', icon: <FaSignInAlt />, showWhen: !isLoggedIn },
    { name: 'حسابي', href: '/account', icon: <FaUser />, showWhen: true },
    { name: 'المكافآت', href: '#rewards', icon: <FaGift />, showWhen: true },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-sakura-50/95 backdrop-blur-md shadow-lg dark:bg-deep-50/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3 space-x-reverse"
          >
            <div className="relative w-12 h-12 bg-gradient-to-br from-sakura-50 to-accent-50 rounded-full p-2 shadow-lg">
              <Image
                src="/images/logo.png"
                alt="مقهى ساكورا"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-light dark:text-text-dark font-arabic">مقهى ساكورا</h1>
              <p className="text-sm text-text-light dark:text-text-dark font-english">Sakura Cafe</p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6 space-x-reverse">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-text-light dark:text-text-dark hover:text-sakura-50 font-medium transition-colors duration-300 relative group font-arabic"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-50 transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>

          {/* Right Side Items */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
            {/* Shopping Cart Icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <button className="relative p-3 text-white hover:text-gray-200 transition-colors duration-300 group">
                <FaShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-[#02393E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  0
                </span>
              </button>
            </motion.div>

            {/* Auth Items */}
            {authItems.map((item, index) => (
              item.showWhen && (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:text-gray-200 font-medium transition-colors duration-300 font-arabic text-sm"
                >
                  {item.icon}
                  {item.name}
                </motion.a>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-gray-200 transition-colors"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#045B62] border-t border-[#02393E]"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Main Menu Items */}
              <nav className="flex flex-col space-y-4 mb-6">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-gray-200 font-medium py-2 transition-colors font-arabic"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-[#02393E] my-4"></div>

              {/* Auth Items */}
              <nav className="flex flex-col space-y-4">
                {authItems.map((item) => (
                  item.showWhen && (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-white hover:text-gray-200 font-medium py-2 transition-colors font-arabic"
                    >
                      {item.icon}
                      {item.name}
                    </a>
                  )
                ))}
              </nav>

              {/* Shopping Cart in Mobile */}
              <div className="border-t border-[#02393E] mt-4 pt-4">
                <button className="flex items-center gap-3 text-white hover:text-gray-200 font-medium py-2 transition-colors font-arabic">
                  <FaShoppingCart />
                  سلة التسوق (0)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
