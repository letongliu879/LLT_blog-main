import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-3xl font-extrabold leading-9 tracking-tight text-transparent dark:from-white dark:via-gray-200 dark:to-white sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-8 pt-8 xl:grid xl:grid-cols-3 xl:gap-x-10 xl:space-y-0">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {avatar && (
                <>
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-75 blur [.gradient_&]:from-pink-500 [.gradient_&]:via-rose-400 [.gradient_&]:to-purple-500" />
                  <Image
                    src={avatar}
                    alt="avatar"
                    width={192}
                    height={192}
                    className="relative h-48 w-48 rounded-full ring-4 ring-white dark:ring-gray-900"
                  />
                </>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold leading-8 tracking-tight">{name}</h3>
              <div className="mt-2 text-cyan-600 dark:text-cyan-400 [.gradient_&]:text-pink-500 dark:[.gradient_&]:text-pink-400">
                {occupation}
              </div>
              <div className="text-gray-500 dark:text-gray-400">{company}</div>
            </div>
            <div className="flex space-x-4 pt-4">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div>
          </div>
          <div className="prose max-w-none pb-8 dark:prose-invert xl:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white/50 p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/50">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
