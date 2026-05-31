import Link from 'next/link'

import {
  siteBodyRelaxedClass,
  siteHeading3Class,
} from '@/lib/site-styles'
import type { Experience } from '@/lib/experiences'

type Props = {
  experience: Experience
  /** Carte du carrousel horizontal (largeur fixe). */
  compact?: boolean
  openInNewTab?: boolean
}

export function ExperienceCard({
  experience,
  compact = false,
  openInNewTab = false,
}: Props) {
  return (
    <Link
      href={experience.href}
      {...(openInNewTab
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      className={
        compact
          ? 'group flex h-full w-[min(100vw-5rem,300px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524] sm:w-[320px]'
          : 'block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]'
      }
    >
      <img
        src={experience.imageSrc}
        alt={experience.title}
        className="aspect-[16/10] h-auto w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className={siteHeading3Class}>{experience.title}</h3>
        {experience.meta ? (
          <p className="text-sm font-medium text-[#8D5524]">{experience.meta}</p>
        ) : null}
        <p className={`line-clamp-2 flex-1 ${siteBodyRelaxedClass}`}>
          {experience.description}
        </p>
        <p className="text-sm text-neutral-500">{experience.location}</p>
      </div>
    </Link>
  )
}
