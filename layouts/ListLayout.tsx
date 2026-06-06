'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

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

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100 [.gradient_&]:focus:border-pink-500 [.gradient_&]:focus:ring-pink-500"
              />
            </label>
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul>
          {!filteredBlogPosts.length && 'No posts found.'}
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags } = post
            return (
              <li key={path} className="py-4">
                <article className="group relative rounded-xl p-4 transition-all duration-300 hover:shadow-xl">
                  <div className="absolute inset-0 rounded-xl border-2 border-gray-200/60 transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400/10 group-hover:via-blue-400/10 group-hover:to-purple-400/10 dark:border-gray-700/60 [.gradient_&]:group-hover:from-pink-400/10 [.gradient_&]:group-hover:via-rose-400/10 [.gradient_&]:group-hover:to-purple-400/10" />
                  <div className="relative rounded-xl bg-white p-4 dark:bg-gray-900">
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-2xl font-bold leading-8 tracking-tight">
                          <Link
                            href={`/${path}`}
                            className="text-gray-900 transition-colors duration-300 group-hover:text-cyan-600 dark:text-gray-100 dark:group-hover:text-cyan-400 [.gradient_&]:group-hover:text-pink-500"
                          >
                            {title}
                          </Link>
                        </h2>
                        <dl>
                          <dt className="sr-only">Published on</dt>
                          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                          </dd>
                        </dl>
                        <div className="flex flex-wrap">
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
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
