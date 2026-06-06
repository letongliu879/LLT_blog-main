'use client'

import { useState, useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClass = `flex items-center w-full justify-between py-4 transition-all duration-300 ${
    siteMetadata.stickyNav ? 'sticky top-0 z-50' : ''
  } ${
    isScrolled
      ? 'bg-white/80 backdrop-blur-lg shadow-lg dark:bg-gray-950/80 [.gradient_&]:bg-white/60 dark:[.gradient_&]:bg-gray-950/60'
      : 'bg-white dark:bg-gray-950 [.gradient_&]:bg-transparent dark:[.gradient_&]:bg-transparent'
  }`

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="group flex items-center justify-between">
          <div className="mr-3 transition-transform duration-300 group-hover:scale-110">
            <Logo className="h-10 w-10" />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent transition-all duration-300 group-hover:from-cyan-600 group-hover:to-blue-600 dark:from-white dark:to-gray-300 dark:group-hover:from-cyan-400 dark:group-hover:to-blue-400 sm:block [.gradient_&]:group-hover:from-pink-400 [.gradient_&]:group-hover:to-rose-400">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-3 leading-5 sm:space-x-5">
        <nav className="no-scrollbar hidden max-w-40 items-center space-x-1 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="relative rounded-lg px-3 py-2 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-cyan-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-cyan-400 [.gradient_&]:hover:text-pink-500"
              >
                {link.title}
              </Link>
            ))}
        </nav>
        <div className="flex items-center space-x-2">
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
