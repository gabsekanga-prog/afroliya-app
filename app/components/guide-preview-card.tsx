import Link from 'next/link'

import type { Guide } from '@/lib/guides'
import {
  siteHeading3Class,
  siteCardThumbnailImageClass,
  siteTextLinkInCardClass,
} from '@/lib/site-styles'

type Props = {
  guide: Guide
  className?: string
}

export function GuidePreviewCard({ guide, className = '' }: Props) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a882]/60 hover:shadow-md ${className}`.trim()}
    >
      <div className="overflow-hidden">
        <img
          src={guide.imageSrc}
          alt={guide.imageAlt}
          className={`${siteCardThumbnailImageClass} transition duration-300 group-hover:scale-[1.03]`}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col p-5">
        <h3 className={siteHeading3Class}>{guide.title}</h3>
        <span className={`mt-3 ${siteTextLinkInCardClass}`}>Lire le guide</span>
      </div>
    </Link>
  )
}
