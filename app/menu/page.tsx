'use client'

import React, { useState, useEffect } from 'react'
import SimpleNavbar from '../../components/SimpleNavbar'
import Hero from '../../components/Hero'
import About from '../../components/About'
import Menu from '../../components/Menu'
import Branches from '../../components/Branches'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'

export default function MenuPage() {
  const [activeSection, setActiveSection] = useState('menu')

  // Handle scroll effect and active section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'menu', 'branches', 'contact']
      const scrollPosition = window.scrollY + 150
      
      let currentSection = 'menu'
      
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

  return (
    <div className="min-h-screen bg-deep-50 dark:bg-gray-900">
      <SimpleNavbar />
      
      <div className="pt-16">
        <div id="home">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="menu">
          <Menu />
        </div>
        <div id="branches">
          <Branches />
        </div>
        <div id="contact">
          <Contact />
        </div>
        <div id="footer">
          <Footer />
        </div>
      </div>
    </div>
  )
}