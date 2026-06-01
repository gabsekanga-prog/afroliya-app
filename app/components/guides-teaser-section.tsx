import Link from 'next/link'

import { GuidePreviewCard } from '@/app/components/guide-preview-card'
import type { Guide } from '@/lib/guides'
import {
  guidesTeaserBelowHeroSectionClass,
  siteBodyRelaxedClass,
  siteButtonPrimarySmClass,
  siteHeading2Class,
  siteSectionMutedClass,
} from '@/lib/site-styles'

type Props = {
  guides: Guide[]
  title?: string
  lead?: string
  /** Liste restaurants : fond gris sous le hero. */
  variant?: 'default' | 'below-hero'
}

export function GuidesTeaserSection({
  guides,
  title = 'Nos guides thématiques',
  lead = 'Trouvez l\'adresse parfaite selon vos envies.',
  variant = 'default',
}: Props) {
  if (guides.length === 0) return null

  const sectionClass =
    variant === 'below-hero' ? guidesTeaserBelowHeroSectionClass : siteSectionMutedClass
  const ctaMarginClass = variant === 'below-hero' ? 'mt-6' : 'mt-8 lg:mt-10'

  return (
    <section className={sectionClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className={siteHeading2Class}>{title}</h2>
          <p className={`mt-3 ${siteBodyRelaxedClass}`}>{lead}</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-8">
          {guides.map((guide) => (
            <GuidePreviewCard key={guide.slug} guide={guide} />
          ))}
        </div>

        <Link href="/guides" className={`${ctaMarginClass} ${siteButtonPrimarySmClass}`}>
          Voir tous les guides
        </Link>
      </div>
    </section>
  )
}
