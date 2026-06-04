import Link from 'next/link'
import type { Metadata } from 'next'

import { GuidePreviewCard } from '@/app/components/guide-preview-card'
import { fetchPublishedGuides } from '@/lib/guides'
import {
  siteGuideIntroSectionClass,
  siteGuideListInnerClass,
  siteGuideListSectionClass,
  siteHeading1OnDarkClass,
  siteSubtitleLeadOnDarkClass,
} from '@/lib/site-styles'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Guides thématiques | Afroliya',
  description:
    'Sélections de restaurants africains à Bruxelles : camerounais, congolais, dîners romantiques et plus.',
}

export default async function GuidesIndexPage() {
  const guides = await fetchPublishedGuides()

  return (
    <>
      <section className={siteGuideIntroSectionClass}>
        <div className={siteGuideListInnerClass}>
          <h1 className={siteHeading1OnDarkClass}>
            Guides thématiques
          </h1>
          <p className={`max-w-7xl ${siteSubtitleLeadOnDarkClass}`}>
            Trouvez l'adresse parfaite selon vos envies : spécialités, quartiers, ambiance et plus.
          </p>
        </div>
      </section>

      <section className={siteGuideListSectionClass}>
        <div className={siteGuideListInnerClass}>
          {guides.length === 0 ? (
            <p className="text-base text-neutral-600 md:text-lg">
              Aucun guide publié pour le moment. Revenez bientôt ou parcourez les{' '}
              <Link
                href="/restaurants"
                className="font-semibold text-brand hover:underline"
              >
                restaurants partenaires
              </Link>
              .
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {guides.map((guide) => (
                <GuidePreviewCard key={guide.slug} guide={guide} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
