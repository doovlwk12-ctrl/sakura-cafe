'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { XCircleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useLanguage } from '../../../hooks/LanguageProvider'

const PaymentErrorPage: React.FC = () => {
  const { t, isRTL } = useLanguage()
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    // Get error message from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error') || urlParams.get('message') || 'حدث خطأ في عملية الدفع'
    setErrorMessage(error)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900"
          >
            <XCircleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-3xl font-bold text-gray-900 dark:text-white font-arabic"
          >
            فشل في الدفع
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-arabic"
          >
            {errorMessage}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 space-y-4"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
              <p>يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع أخرى</p>
              <p>إذا استمرت المشكلة، يرجى التواصل معنا</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-sakura-50 text-white rounded-lg hover:bg-sakura-100 transition-colors duration-300 font-arabic"
              >
                <ArrowPathIcon className="w-5 h-5" />
                المحاولة مرة أخرى
              </Link>
              
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300 font-arabic"
              >
                <HomeIcon className="w-5 h-5" />
                العودة للرئيسية
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default PaymentErrorPage
