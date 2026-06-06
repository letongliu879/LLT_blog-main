'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

const gradientPalette =
  'from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-500 [.gradient_&]:from-[#5eead4] [.gradient_&]:via-[#6366f1] [.gradient_&]:to-[#f472b6] dark:[.gradient_&]:from-[#0d9488] dark:[.gradient_&]:to-[#c084fc]'

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+$/, '') // Remove any trailing /page
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex items-center justify-between">
        {!prevPage && (
          <button
            className="flex cursor-not-allowed items-center space-x-2 rounded-lg px-4 py-2 text-gray-400 dark:text-gray-500"
            disabled={!prevPage}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Previous</span>
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:via-blue-400/10 hover:to-purple-400/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-cyan-400/10 dark:hover:via-blue-400/10 dark:hover:to-purple-400/10 [.gradient_&]:hover:from-pink-400/10 [.gradient_&]:hover:via-rose-400/10 [.gradient_&]:hover:to-purple-400/10"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Previous</span>
          </Link>
        )}
        <span className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className="flex cursor-not-allowed items-center space-x-2 rounded-lg px-4 py-2 text-gray-400 dark:text-gray-500"
            disabled={!nextPage}
          >
            <span>Next</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {nextPage && (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:via-blue-400/10 hover:to-purple-400/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-cyan-400/10 dark:hover:via-blue-400/10 dark:hover:to-purple-400/10 [.gradient_&]:hover:from-pink-400/10 [.gradient_&]:hover:via-rose-400/10 [.gradient_&]:hover:to-purple-400/10"
          >
            <span>Next</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3
                  className={`inline-flex rounded-lg border-2 border-cyan-500 bg-cyan-50 px-3 py-2 text-sm font-bold uppercase text-cyan-700 dark:border-cyan-400 dark:bg-cyan-900/30 dark:text-cyan-300 [.gradient_&]:border-pink-500 [.gradient_&]:bg-pink-50 [.gradient_&]:text-pink-700 dark:[.gradient_&]:border-pink-400 dark:[.gradient_&]:bg-pink-900/30 dark:[.gradient_&]:text-pink-300`}
                >
                  All Posts
                </h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="inline-flex rounded-lg px-3 py-2 text-sm font-bold uppercase text-gray-700 transition-colors hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500 [.gradient_&]:hover:text-pink-500"
                >
                  All Posts
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                        <h3
                          className={`inline-flex rounded-lg border-2 border-cyan-500 bg-cyan-50 px-3 py-2 text-sm font-bold uppercase text-cyan-700 dark:border-cyan-400 dark:bg-cyan-900/30 dark:text-cyan-300 [.gradient_&]:border-pink-500 [.gradient_&]:bg-pink-50 [.gradient_&]:text-pink-700 dark:[.gradient_&]:border-pink-400 dark:[.gradient_&]:bg-pink-900/30 dark:[.gradient_&]:text-pink-300`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="inline-flex rounded-lg px-3 py-2 text-sm font-medium uppercase text-gray-500 transition-all duration-300 hover:bg-gray-100 hover:text-cyan-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-cyan-400 [.gradient_&]:hover:text-pink-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="py-5">
                    <article className="group relative rounded-xl p-4 transition-all duration-300 hover:shadow-xl">
                      {/* Hover gradient border effect */}
                      <div className="absolute inset-0 rounded-xl border-2 border-gray-200/60 transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400/10 group-hover:via-blue-400/10 group-hover:to-purple-400/10 dark:border-gray-700/60 [.gradient_&]:group-hover:from-pink-400/10 [.gradient_&]:group-hover:via-rose-400/10 [.gradient_&]:group-hover:to-purple-400/10" />
                      <div className="relative rounded-xl bg-white p-4 dark:bg-gray-900">
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="flex items-center space-x-2 text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
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
                            <time dateTime={date} suppressHydrationWarning>
                              {formatDate(date, siteMetadata.locale)}
                            </time>
                          </dd>
                        </dl>
                        <div className="mt-2 space-y-3">
                          <div>
                            <h2 className="text-2xl font-bold leading-8 tracking-tight">
                              <Link
                                href={`/${path}`}
                                className="text-gray-900 transition-colors duration-300 group-hover:text-cyan-600 dark:text-gray-100 dark:group-hover:text-cyan-400 [.gradient_&]:group-hover:text-pink-500"
                              >
                                {title}
                              </Link>
                            </h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {tags?.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
