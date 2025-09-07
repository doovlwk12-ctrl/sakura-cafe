/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        arabic: ['var(--font-tajawal)', 'Tajawal', 'sans-serif'],
        english: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        // Sakura Café Brand Color System
        sakura: {
          50: '#C36C72',   // Sakura Pink - Main titles, primary buttons
          100: '#B85A60',
          200: '#AD484E',
          300: '#A2363C',
          400: '#97242A',
          500: '#8C1218',
          600: '#810006',
          700: '#760000',
          800: '#6B0000',
          900: '#600000',
        },
        deep: {
          50: '#1D453E',   // Deep Green - Text and secondary headers
          100: '#1A3E37',
          200: '#173730',
          300: '#143029',
          400: '#112922',
          500: '#0E221B',
          600: '#0B1B14',
          700: '#08140D',
          800: '#050D06',
          900: '#020600',
        },
        accent: {
          50: '#2A4842',   // Accent Green - Secondary buttons and hover states
          100: '#27413B',
          200: '#243A34',
          300: '#21332D',
          400: '#1E2C26',
          500: '#1B251F',
          600: '#181E18',
          700: '#151711',
          800: '#12100A',
          900: '#0F0903',
        },
        // Background and Text Colors
        background: {
          light: '#F9FAF9',  // Light background
          dark: '#1D453E',   // Dark background
          white: '#FFFFFF',  // Cards, modals, forms
        },
        text: {
          light: '#333333',  // Light mode text
          dark: '#F9FAF9',   // Dark mode text
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
