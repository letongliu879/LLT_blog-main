'use client'

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from '@/components/NewsletterForm'
import TypeWriter from '@/components/TypeWriter'

const MAX_DISPLAY = 5
interface Post {
  slug: string
  date: string
  title: string
  summary?: string
  tags: string[]
}

const FALLBACK_WORDS = [
  'Machine Learning',
  'Deep Learning',
  'Neural Networks',
  'Data Science',
  'AI Engineering',
]

export default function Home({ posts, topTags }: { posts: Post[]; topTags?: string[] }) {
  const typewriterWords = topTags && topTags.length > 0 ? topTags : FALLBACK_WORDS

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Hero Section with Typewriter */}
        <div className="space-y-6 pb-10 pt-8 md:space-y-8">
          {/* Animated gradient background */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f6faff] via-[#e9f2ff] to-[#ddebff] p-8 dark:from-[#0b1424] dark:via-[#0e1b33] dark:to-[#12264a] md:p-12 [.gradient_&]:from-[#fffcfd] [.gradient_&]:via-[#fffbfe] [.gradient_&]:to-[#f8faff] dark:[.gradient_&]:from-[#1a0a14] dark:[.gradient_&]:via-[#120a1e] dark:[.gradient_&]:to-[#0a0f1e]">
            <div className="bg-grid-pattern absolute inset-0 opacity-[0.04] [.gradient_&]:opacity-0" />
            {/* A-style: subtle static glow orbs for light/dark */}
            <div className="from-sky-300/24 to-blue-500/22 absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br blur-3xl [.gradient_&]:hidden" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-500/20 blur-3xl [.gradient_&]:hidden" />
            {/* C-style: animated mesh blobs for gradient theme */}
            <div className="pointer-events-none absolute inset-0 hidden [.gradient_&]:block">
              <div className="mesh-blob mesh-blob-1" />
              <div className="mesh-blob mesh-blob-2" />
              <div className="mesh-blob mesh-blob-3" />
            </div>

            <div className="relative z-10">
              <h1 className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent dark:from-white dark:via-gray-200 dark:to-white sm:text-5xl md:text-6xl">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent [.gradient_&]:from-pink-400 [.gradient_&]:via-rose-300 [.gradient_&]:to-purple-400">
                  {siteMetadata.headerTitle || 'My Blog'}
                </span>
              </h1>
              <div className="mt-4 text-xl text-gray-600 dark:text-gray-300 md:text-2xl">
                Exploring{' '}
                <TypeWriter
                  words={typewriterWords}
                  typeSpeed={80}
                  deleteSpeed={40}
                  delayBetweenWords={2500}
                  className="font-semibold text-cyan-600 dark:text-cyan-400 [.gradient_&]:text-pink-500"
                />
              </div>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                {siteMetadata.description}
              </p>
            </div>
          </div>

          {/* Section title */}
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
              Latest Posts
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700" />
          </div>
        </div>

        {/* Posts List with hover effects */}
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-6">
                <article className="group relative rounded-xl p-4 transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0 rounded-xl border-2 border-gray-200/60 transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400/10 group-hover:via-blue-400/10 group-hover:to-purple-400/10 dark:border-gray-700/60 [.gradient_&]:group-hover:from-pink-400/10 [.gradient_&]:group-hover:via-rose-400/10 [.gradient_&]:group-hover:to-purple-400/10" />
                  <div className="relative rounded-xl bg-white/80 p-4 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white dark:bg-gray-900/80 dark:group-hover:bg-gray-900 [.gradient_&]:bg-white/40 dark:[.gradient_&]:bg-gray-900/40">
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date} className="flex items-center space-x-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{formatDate(date, siteMetadata.locale)}</span>
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-4 xl:col-span-3">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-2xl font-bold leading-8 tracking-tight">
                              <Link
                                href={`/blog/${slug}`}
                                className="text-gray-900 transition-colors duration-300 group-hover:text-cyan-600 dark:text-gray-100 dark:group-hover:text-cyan-400 [.gradient_&]:group-hover:text-pink-500"
                              >
                                {title}
                              </Link>
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                        <div className="text-base font-medium leading-6">
                          <Link
                            href={`/blog/${slug}`}
                            className="inline-flex items-center space-x-2 text-primary-500 transition-all duration-300 hover:text-primary-600 group-hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 dark:group-hover:text-primary-300 [.gradient_&]:text-pink-500 [.gradient_&]:hover:text-pink-600 [.gradient_&]:group-hover:text-pink-600"
                            aria-label={`Read more: "${title}"`}
                          >
                            <span>Read more</span>
                            <svg
                              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end pt-6 text-base font-medium leading-6">
          <Link
            href="/blog"
            className="group inline-flex items-center space-x-2 font-semibold text-primary-500 transition-colors duration-300 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 [.gradient_&]:text-pink-500 [.gradient_&]:hover:text-pink-600"
            aria-label="All posts"
          >
            <span>All Posts</span>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      )}

      {siteMetadata.newsletter?.provider && (
        <div className="mt-12 flex items-center justify-center">
          <div className="w-full max-w-md rounded-[28px] bg-gradient-to-br from-[#fef3ff] via-[#eef3ff] to-[#e0f7ff] p-8 shadow-2xl dark:from-[#080b18] dark:via-[#10142f] dark:to-[#1d1f3d]">
            <h3 className="mb-4 text-center text-xl font-bold text-gray-900 dark:text-gray-100">
              Subscribe to Newsletter
            </h3>
            <NewsletterForm />
          </div>
        </div>
      )}
    </>
  )
}
