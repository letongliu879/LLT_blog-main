'use client'

import { isValidElement, useRef, useState, type ReactNode } from 'react'
import Mermaid from './Mermaid'

interface PreProps {
  children?: ReactNode
  className?: string
  [key: string]: unknown
}

const languageNames: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  py: 'Python',
  python: 'Python',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  'c++': 'C++',
  cs: 'C#',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  rb: 'Ruby',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  less: 'Less',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
  md: 'Markdown',
  markdown: 'Markdown',
  mdx: 'MDX',
  sh: 'Shell',
  bash: 'Bash',
  zsh: 'Zsh',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  dockerfile: 'Dockerfile',
  docker: 'Docker',
  graphql: 'GraphQL',
  vue: 'Vue',
  svelte: 'Svelte',
  r: 'R',
  scala: 'Scala',
  perl: 'Perl',
  lua: 'Lua',
  dart: 'Dart',
  elixir: 'Elixir',
  erlang: 'Erlang',
  haskell: 'Haskell',
  clojure: 'Clojure',
  mermaid: 'Mermaid',
}

export default function Pre({ children, className, ...props }: PreProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const extractText = (node: ReactNode): string => {
    if (node === null || node === undefined || typeof node === 'boolean') return ''
    if (typeof node === 'string' || typeof node === 'number') return String(node)
    if (Array.isArray(node)) return node.map(extractText).join('')
    if (isValidElement(node)) return extractText(node.props?.children)
    return ''
  }

  // Extract language from className (e.g., "language-javascript")
  let language = ''
  const childElement = children as React.ReactElement<{ className?: string; children?: string }>
  if (childElement?.props?.className) {
    const match = childElement.props.className.match(/language-(\w+)/)
    if (match) {
      language = match[1]
    }
  }

  // Check if this is a mermaid code block
  if (language === 'mermaid' && childElement?.props?.children) {
    const raw = childElement.props.children as ReactNode
    const chartContent =
      Array.isArray(raw) &&
      raw.length > 0 &&
      raw.every((n) => {
        if (!isValidElement(n)) return false
        const props = n.props as { className?: unknown }
        return typeof props.className === 'string' && props.className.includes('line')
      })
        ? raw.map((line) => extractText(line)).join('\n')
        : extractText(raw)

    return <Mermaid chart={chartContent.trim()} />
  }

  const displayLanguage = language ? languageNames[language.toLowerCase()] || language : 'Code'

  const handleCopy = async () => {
    if (preRef.current) {
      const code = preRef.current.textContent || ''
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-900 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <div className="flex items-center space-x-2">
          {/* Terminal dots */}
          <div className="flex space-x-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          {/* Language label */}
          <span className="ml-3 text-xs font-medium text-gray-400">{displayLanguage}</span>
        </div>
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg
                className="h-4 w-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre
        ref={preRef}
        className={`overflow-x-auto p-4 text-sm leading-relaxed [&>code>.line>.line-number]:table-cell [&>code>.line>.line-number]:select-none [&>code>.line>.line-number]:pr-4 [&>code>.line>.line-number]:text-right [&>code>.line>.line-number]:text-gray-500 [&>code>.line>.line-number]:opacity-50 [&>code>.line]:table-row [&>code]:block ${className || ''}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
