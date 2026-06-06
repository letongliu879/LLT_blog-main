'use client'

import { useState, useEffect, useCallback } from 'react'

interface TypeWriterProps {
  words: string[]
  typeSpeed?: number
  deleteSpeed?: number
  delayBetweenWords?: number
  className?: string
}

export default function TypeWriter({
  words,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenWords = 2000,
  className = '',
}: TypeWriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const type = useCallback(() => {
    const currentWord = words[currentWordIndex]

    if (isDeleting) {
      setCurrentText((prev) => prev.slice(0, -1))
      if (currentText === '') {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      }
    } else {
      setCurrentText(currentWord.slice(0, currentText.length + 1))
      if (currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), delayBetweenWords)
        return
      }
    }
  }, [currentText, currentWordIndex, isDeleting, words, delayBetweenWords])

  useEffect(() => {
    const timeout = setTimeout(type, isDeleting ? deleteSpeed : typeSpeed)
    return () => clearTimeout(timeout)
  }, [type, isDeleting, deleteSpeed, typeSpeed])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse text-primary-500">|</span>
    </span>
  )
}
