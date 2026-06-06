import Link from '@/components/Link'
import Tag from '@/components/Tag'
import TagCloud from '@/components/TagCloud'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-extrabold leading-9 tracking-tight text-transparent dark:from-white dark:to-gray-300 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-2xl flex-wrap justify-center">
          {tagKeys.length === 0 && 'No tags found.'}
          <TagCloud tags={tagCounts} />
        </div>
      </div>
    </>
  )
}
