import TOCInline from 'pliny/ui/TOCInline'
import NewsletterForm from './NewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Pre from './Pre'
import IframeEmbed from './IframeEmbed'

export const components: MDXComponents = {
  Image,
  TOCInline,
  IframeEmbed,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm: NewsletterForm,
}
