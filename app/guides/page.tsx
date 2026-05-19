import {
  siteGuideIntroSectionClass,
  siteGuideListSectionClass,
  siteHeading1PageClass,
  siteHeading1OnDarkClass,
  siteHeading3OnDarkClass,
  siteHeroBreadcrumbOnDarkClass,
  siteHeroSectionClass,
  siteBodyClass,
  siteButtonPrimaryClass,
} from '@/lib/site-styles'
import Link from 'next/link'
import type { Metadata } from 'next'

import { fetchPublishedGuides } from '@/lib/guides'

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
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav aria-label="Fil d'Ariane" className="text-base text-neutral-600 md:text-lg">
            <span className="font-semibold text-neutral-900" aria-current="page">
              Guides thématiques
            </span>
          </nav>
          <h1 className={`mt-6 ${siteHeading1PageClass}`}>
            Guides thématiques
          </h1>
          <p className="mt-3 max-w-6xl text-base text-neutral-600 md:text-lg">
            Explorez des restaurants afro selon vos envies : sélections par pays,
            ambiance et quartiers à Bruxelles et autour.
          </p>
        </div>
      </section>

      <section className={siteGuideListSectionClass}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group relative flex min-h-[240px] flex-col overflow-hidden rounded-2xl border border-neutral-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <img
                    src={guide.imageSrc}
                    alt={guide.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/99 via-[#2a1810]/62 to-[#2a1810]/28"
                    aria-hidden
                  />
                  <div className="relative mt-auto p-6">
                    <h2 className={siteHeading3OnDarkClass}>
                      {guide.title}
                    </h2>
                    <span className="mt-3 inline-flex text-base font-semibold text-[#f8e9dc] underline-offset-4 group-hover:underline">
                      Lire le guide
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
