import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      } group overflow-hidden rounded-xl border-2 border-gray-200 border-opacity-60 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-400 hover:shadow-xl dark:border-gray-700 dark:hover:border-cyan-500 [.gradient_&]:hover:border-pink-400 dark:[.gradient_&]:hover:border-pink-500`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105 md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105 md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight transition-colors duration-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 [.gradient_&]:group-hover:text-pink-500 dark:[.gradient_&]:group-hover:text-pink-400">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center space-x-1 text-base font-medium leading-6 text-cyan-600 transition-all duration-300 hover:translate-x-1 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 [.gradient_&]:text-pink-500 [.gradient_&]:hover:text-pink-600 dark:[.gradient_&]:text-pink-400 dark:[.gradient_&]:hover:text-pink-300"
            aria-label={`Link to ${title}`}
          >
            <span>Learn more</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
