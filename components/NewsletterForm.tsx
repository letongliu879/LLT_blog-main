'use client'

import { FormEvent, useRef, useState } from 'react'

type NewsletterResponse = {
  error?: string
  message?: string
  fallbackUrl?: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function NewsletterForm({
  title = 'Subscribe to the newsletter',
  apiUrl = '/api/newsletter',
}: {
  title?: string
  apiUrl?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [fallbackUrl, setFallbackUrl] = useState('')

  const isSubmitting = status === 'submitting'
  const isSubscribed = status === 'success'
  const isError = status === 'error'

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!inputRef.current || isSubmitting || isSubscribed) {
      return
    }

    const email = inputRef.current.value.trim()
    setStatus('submitting')
    setMessage('')
    setFallbackUrl('')

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = (await response.json().catch(() => ({}))) as NewsletterResponse

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error || 'Unable to subscribe right now. Please try again later.')
        setFallbackUrl(data.fallbackUrl || '')
        return
      }

      inputRef.current.value = ''
      setStatus('success')
      setMessage(data.message || '订阅成功，请去邮箱点确认链接。')
    } catch {
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
    }
  }

  return (
    <div>
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      <form className="flex flex-col sm:flex-row" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email-input">
            <span className="sr-only">Email address</span>
            <input
              id="email-input"
              ref={inputRef}
              type="email"
              name="email"
              autoComplete="email"
              required
              disabled={isSubmitting || isSubscribed}
              placeholder={isSubscribed ? "You're subscribed! 🎉" : 'Enter your email'}
              className="w-72 rounded-md px-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-black [.gradient_&]:focus:ring-pink-600"
            />
          </label>
        </div>

        <div className="mt-2 flex w-full rounded-md shadow-sm sm:ml-3 sm:mt-0">
          <button
            type="submit"
            disabled={isSubmitting || isSubscribed}
            className={`w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:ring-offset-black sm:py-0 [.gradient_&]:bg-pink-500 [.gradient_&]:focus:ring-pink-600 ${
              isSubmitting || isSubscribed
                ? 'cursor-default opacity-80'
                : 'hover:bg-primary-700 dark:hover:bg-primary-400 [.gradient_&]:hover:bg-pink-600 dark:[.gradient_&]:hover:bg-pink-400'
            }`}
          >
            {isSubmitting ? 'Submitting...' : isSubscribed ? 'Thank you!' : 'Sign up'}
          </button>
        </div>
      </form>

      {isError && (
        <div className="w-72 pt-2 text-sm text-red-500 dark:text-red-400 sm:w-96">
          <p>{message}</p>
          {fallbackUrl && (
            <p className="mt-1">
              Prefer email?{' '}
              <a
                href={fallbackUrl}
                className="text-primary-500 underline underline-offset-2 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 [.gradient_&]:text-pink-500 [.gradient_&]:hover:text-pink-600 dark:[.gradient_&]:text-pink-400 dark:[.gradient_&]:hover:text-pink-300"
              >
                Subscribe via fallback link
              </a>
              .
            </p>
          )}
        </div>
      )}

      {isSubscribed && (
        <div className="w-72 pt-2 text-sm text-green-600 dark:text-green-400 sm:w-96">
          {message}
        </div>
      )}
    </div>
  )
}
