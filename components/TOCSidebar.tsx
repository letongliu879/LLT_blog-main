'use client'

import { useState, useEffect, useCallback } from 'react'

interface TocItem {
  value: string
  url: string
  depth: number
}

interface TOCSidebarProps {
  toc: TocItem[]
}

export default function TOCSidebar({ toc }: TOCSidebarProps) {
  const [activeId, setActiveId] = useState<string>('')

  const handleScroll = useCallback(() => {
    const headings = toc.map((item) => {
      const id = item.url.replace('#', '')
      const element = document.getElementById(id)
      return { id, top: element?.getBoundingClientRect().top ?? Infinity }
    })

    // Find the first heading that's below the top of the viewport (with offset)
    const offset = 100
    const current = headings.find((h) => h.top > offset) || headings[headings.length - 1]

    // Get the previous heading (the one we're currently reading)
    const currentIndex = headings.findIndex((h) => h.id === current?.id)
    const activeHeading = currentIndex > 0 ? headings[currentIndex - 1] : headings[0]

    if (activeHeading) {
      setActiveId(activeHeading.id)
    }
  }, [toc])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (!toc.length) return null

  return (
    <nav className="hidden max-h-[calc(100vh-200px)] overflow-y-auto xl:block">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        On this page
      </h2>
      <ul className="space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
        {toc.map((item) => {
          const id = item.url.replace('#', '')
          const isActive = activeId === id
          const paddingLeft = (item.depth - 1) * 12 + 12

          return (
            <li key={item.url}>
              <a
                href={item.url}
                style={{ paddingLeft: `${paddingLeft}px` }}
                className={`-ml-[2px] block border-l-2 py-1 text-sm transition-all duration-200 ${
                  isActive
                    ? 'border-cyan-500 font-medium text-cyan-600 dark:text-cyan-400 [.gradient_&]:border-pink-500 [.gradient_&]:text-pink-600 dark:[.gradient_&]:text-pink-400'
                    : 'border-transparent text-gray-600 hover:border-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                    setActiveId(id)
                  }
                }}
              >
                {item.value}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
