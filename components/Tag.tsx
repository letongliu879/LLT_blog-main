import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 [.gradient_&]:text-pink-500 [.gradient_&]:hover:text-pink-600"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
