'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../hooks/LanguageProvider'

const Contact = () => {
  const { t, isRTL } = useLanguage()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitMessage(result.message)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        
        // إظهار تفاصيل الإرسال في الكونسول
        console.log('📧 تفاصيل الرسالة المرسلة:', result)
        
        // إخفاء الرسالة بعد 5 ثوان
        setTimeout(() => setSubmitMessage(''), 5000)
      } else {
        const errorData = await response.json()
        setSubmitMessage(errorData.message || 'حدث خطأ في إرسال رسالتك')
      }
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error)
      setSubmitMessage('حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[#F6F7F6] to-[#F9F7F6] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="text-gradient">{t('contact.title')}</span>
            <br />
            <span className="text-2xl text-[#045B62] english-text">{t('contact.subtitle')}</span>
          </h2>
          <p className="text-lg text-[#045B62] max-w-3xl mx-auto leading-relaxed">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-coffee-800 mb-6">{t('contact.sendMessage')}</h3>
            
            {/* رسالة النجاح/الخطأ */}
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitMessage.includes('نجاح') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <p className="font-medium">{submitMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-[#045B62] font-medium mb-2">
                    {t('contact.fullName')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[#045B62]/30 rounded-lg focus:ring-2 focus:ring-[#045B62] focus:border-transparent transition-all duration-300"
                    placeholder={t('contact.fullNamePlaceholder')}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-[#045B62] font-medium mb-2">
                    {t('contact.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#045B62]/30 rounded-lg focus:ring-2 focus:ring-[#045B62] focus:border-transparent transition-all duration-300"
                    placeholder={t('contact.phonePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[#045B62] font-medium mb-2">
                  {t('contact.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#045B62]/30 rounded-lg focus:ring-2 focus:ring-[#045B62] focus:border-transparent transition-all duration-300"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-[#045B62] font-medium mb-2">
                  {t('contact.subject')} *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#045B62]/30 rounded-lg focus:ring-2 focus:ring-[#045B62] focus:border-transparent transition-all duration-300"
                >
                  <option value="">{t('contact.chooseSubject')}</option>
                  <option value="feedback">{t('contact.feedback')}</option>
                  <option value="partnership">{t('contact.partnership')}</option>
                  <option value="other">{t('contact.other')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[#045B62] font-medium mb-2">
                  {t('contact.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-[#045B62]/30 rounded-lg focus:ring-2 focus:ring-[#045B62] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder={t('contact.writeMessage')}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary text-lg py-4 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  t('contact.sendButton')
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
