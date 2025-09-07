'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // محاكاة عملية التسجيل
    setTimeout(() => {
      console.log('بيانات التسجيل:', formData)
      setIsSubmitting(false)
      // هنا يمكن إضافة منطق التسجيل الفعلي
    }, 1500)
  }

  return (
    <section id="register" className="py-20 bg-gradient-to-br from-sakura-50 to-coffee-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="text-gradient">تسجيل حساب جديد</span>
            <br />
            <span className="text-2xl text-coffee-500 english-text font-medium">Create New Account</span>
          </h2>
          <p className="text-lg text-coffee-500 max-w-3xl mx-auto leading-relaxed font-arabic">
            انضم إلى عائلة مقهى ساكورا واحصل على عروض حصرية وخصومات خاصة
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            {/* اسم المستخدم */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-coffee-700 font-medium mb-3 font-arabic text-right">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaUser className="text-coffee-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pr-10 pl-4 py-4 border-2 border-coffee-200 rounded-xl focus:border-sakura-500 focus:outline-none transition-colors font-arabic text-right"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="mb-6">
              <label htmlFor="phone" className="block text-coffee-700 font-medium mb-3 font-arabic text-right">
                رقم الهاتف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaPhone className="text-coffee-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pr-10 pl-4 py-4 border-2 border-coffee-200 rounded-xl focus:border-sakura-500 focus:outline-none transition-colors font-arabic text-right"
                  placeholder="+966 50 123 4567"
                />
              </div>
            </div>

            {/* كلمة السر */}
            <div className="mb-8">
              <label htmlFor="password" className="block text-coffee-700 font-medium mb-3 font-arabic text-right">
                كلمة السر
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaLock className="text-coffee-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pr-10 pl-4 py-4 border-2 border-coffee-200 rounded-xl focus:border-sakura-500 focus:outline-none transition-colors font-arabic text-right"
                  placeholder="أدخل كلمة السر"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-coffee-400 hover:text-coffee-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* زر التسجيل */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-arabic text-lg"
            >
              {isSubmitting ? 'جاري التسجيل...' : 'تسجيل'}
            </button>

            {/* معلومات إضافية */}
            <p className="text-center text-coffee-500 text-sm mt-6 font-arabic">
              بالتسجيل، أنت توافق على{' '}
              <a href="#" className="text-sakura-600 hover:text-sakura-700 font-medium">
                شروط الاستخدام
              </a>{' '}
              و{' '}
              <a href="#" className="text-sakura-600 hover:text-sakura-700 font-medium">
                سياسة الخصوصية
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default RegisterForm
