import Link from '@/components/Link'
import { slug } from 'github-slugger'

interface TagCloudProps {
  tags: Record<string, number>
}

export default function TagCloud({ tags }: TagCloudProps) {
  const tagKeys = Object.keys(tags)
  const sortedTags = tagKeys.sort((a, b) => tags[b] - tags[a])

  // Calculate font size based on tag count
  const maxCount = Math.max(...Object.values(tags))
  const minCount = Math.min(...Object.values(tags))

  const getTagSize = (count: number) => {
    if (maxCount === minCount) return 'text-base'
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio > 0.8) return 'text-2xl font-bold'
    if (ratio > 0.6) return 'text-xl font-semibold'
    if (ratio > 0.4) return 'text-lg font-medium'
    if (ratio > 0.2) return 'text-base'
    return 'text-sm'
  }

  // Color classes for tags
  const colorClasses = [
    'text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 [.gradient_&]:text-pink-600 [.gradient_&]:hover:text-pink-700 dark:[.gradient_&]:text-pink-400 dark:[.gradient_&]:hover:text-pink-300',
    'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
    'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300',
    'text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300',
    'text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300',
    'text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300',
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      {sortedTags.map((tag, index) => {
        const count = tags[tag]
        const sizeClass = getTagSize(count)
        const colorClass = colorClasses[index % colorClasses.length]

        return (
          <Link
            key={tag}
            href={`/tags/${slug(tag)}`}
            className={`group relative inline-block transition-all duration-300 hover:scale-110 ${sizeClass} ${colorClass}`}
            aria-label={`View posts tagged ${tag}`}
          >
            <span className="relative z-10">{tag}</span>
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-700 dark:text-gray-300">
              {count}
            </span>
            <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100 [.gradient_&]:from-pink-500/10 [.gradient_&]:to-rose-500/10" />
          </Link>
        )
      })}
    </div>
  )
}
