'use client'

import { motion } from 'framer-motion'
import { FaPhone, FaEnvelope, FaInstagram, FaWhatsapp, FaArrowUp, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import Image from 'next/image'
import { useLanguage } from '../hooks/LanguageProvider'

const Footer = () => {
  const { t } = useLanguage()
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    main: [
      { name: t('nav.home'), href: '#home' },
      { name: t('nav.about'), href: '#about' },
      { name: t('nav.menu'), href: '#menu' },
      { name: t('nav.branches'), href: '#branches' },
      { name: t('nav.contact'), href: '#contact' }
    ]
  }

  const socialMedia = [
    { icon: <FaInstagram />, name: t('footer.social.instagram'), href: 'https://www.instagram.com/sakuraacafe/?hl=ar', color: 'hover:text-pink-600' },
    { icon: <FaXTwitter />, name: t('footer.social.twitter'), href: 'https://x.com/sakuraacafee/highlights', color: 'hover:text-blue-400' },
    { icon: <FaLinkedin />, name: t('footer.social.linkedin'), href: 'https://sa.linkedin.com/company/sakura-caf%C3%A9', color: 'hover:text-blue-600' },
    { icon: <FaWhatsapp />, name: t('footer.social.whatsapp'), href: 'https://api.whatsapp.com/send/?phone=00966500707832&text&type=phone_number&app_absent=0', color: 'hover:text-green-600' }
  ]

  return (
    <footer id="footer" className="bg-gradient-to-br from-[#02393E] to-[#0D484E] dark:from-gray-900 dark:to-black text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="relative w-12 h-12 bg-gradient-to-br from-[#045B62] to-[#02393E] rounded-full p-2 shadow-lg">
                  <Image
                    src="/images/logo.png"
                    alt="مقهى ساكورا"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{t('brand.name')}</h3>
                  <p className="text-gray-200 english-text">{t('footer.brandEnglish')}</p>
                </div>
              </div>
              
              <p className="text-gray-200 mb-6 leading-relaxed">
                {t('footer.description')}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-200">
                  <FaPhone className="text-white" />
                  <span>+966 50 123 4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-200">
                  <FaEnvelope className="text-white" />
                  <span>info@sakuraacafe.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-bold text-sakura-300 mb-4">
                {t('footer.quickLinks')}
              </h4>
              <ul className="space-y-2">
                {footerLinks.main.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-coffee-200 hover:text-sakura-300 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-coffee-700 mt-12 pt-8"
        >
          <div className="flex items-center justify-center gap-6">
            <span className="text-coffee-200 font-medium">{t('footer.followUs')}:</span>
            {socialMedia.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : '_self'}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`w-10 h-10 bg-coffee-800 text-coffee-200 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-coffee-700`}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-coffee-700">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="text-coffee-300 text-sm">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 left-8 w-12 h-12 bg-sakura-600 hover:bg-sakura-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowUp />
      </motion.button>
    </footer>
  )
}

export default Footer
