'use client'

import SimpleNavbar from '@/components/SimpleNavbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Menu from '@/components/Menu'
import Branches from '@/components/Branches'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fefefe] dark:bg-[#111827] transition-colors duration-300">
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
    </main>
  )
}
