'use client'

import Link from 'next/link'
import { CalendarCheck, MapPin, StarIcon } from 'lucide-react'
import {
  siteBodyClass,
  siteBodyRelaxedClass,
  siteButtonOnDarkClass,
  siteButtonOnDarkOutlineClass,
  siteButtonPrimaryClass,
  siteButtonPrimarySmClass,
  siteHeading2Class,
  siteHeading2LeadingClass,
  siteHeading3Class,
  siteSectionContentSecondClass,
  siteCardOnMutedClass,
  siteSectionColumnImageClass,
  siteSectionColumnImageTallSmClass,
  siteSectionMediaFirstClass,
  siteSectionMutedClass,
  siteSectionWhiteClass,
  siteBodySemiboldClass,
  sitePainPointItemClass,
  sitePainPointsListClass,
} from '@/lib/site-styles'

import type { Guide } from '@/lib/guides'

import { CommunitySignupSection } from './community-signup-section'
import { GuidesTeaserSection } from './guides-teaser-section'
import { MarketingSplitHero } from './marketing-split-hero'
import { PlatformStatsList } from './platform-stats-list'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

const plaisirBlocks = [
  {
    title: 'Plein d\'adresses à tester',
    description:
      'Ne perdez plus de temps à chercher partout. Découvrez facilement de nouveaux restaurants afro et variez les plaisirs.',
    icon: MapPin,
  },
  {
    title: 'Guides thématiques',
    description:
      'Trouvez l\'adresse parfaite selon vos envies grâce à nos sélections ciblées et originales.',
    icon: StarIcon,
  },
  {
    title: 'Réservation en ligne',
    description:
      'Bloquez votre table en quelques clics, gratuitement. Plus besoin de vous soucier des horaires ni de rappeler 5 fois.',
    icon: CalendarCheck,
  },
]

type Props = {
  latestGuides: Guide[]
}

export function HomePageClient({ latestGuides }: Props) {
  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader active="concept" />

      <MarketingSplitHero
        imageSrc="/images/Couple manger restaurant africain.jpg"
        imageAlt="Couple profitant d'un repas dans un restaurant africain"
        title="Votre plateforme de restaurants afro à Bruxelles et autour"
        lead="Plein d'adresses à tester | Guides thématiques | Réservation en ligne"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/restaurants"
            className={`${siteButtonOnDarkClass} h-12 min-w-[230px]`}
          >
            Trouver un restaurant
          </Link>
          <Link
            href="/on-mange-quoi"
            className={`${siteButtonOnDarkOutlineClass} h-12 min-w-[230px]`}
          >
            On mange quoi ?
          </Link>
        </div>
      </MarketingSplitHero>

      <section className={siteSectionWhiteClass}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div className={siteSectionContentSecondClass}>
            <h2 className={siteHeading2LeadingClass}>
            À la recherche d'un restaurant afro à tester ?
            </h2>
            <ul className={`mt-7 space-y-3 ${sitePainPointsListClass}`}>
              <li className={sitePainPointItemClass}>
                <span className="shrink-0" aria-hidden>
                  ✖︎
                </span>
                <span>Vous tournez en rond avec les mêmes adresses</span>
              </li>
              <li className={sitePainPointItemClass}>
                <span className="shrink-0" aria-hidden>
                  ✖︎
                </span>
                <span>Vous perdez du temps à chercher sur Instagram et TikTok</span>
              </li>
              <li className={sitePainPointItemClass}>
                <span className="shrink-0" aria-hidden>
                  ✖︎
                </span>
                <span>Vous dépendez toujours des recommandations de vos proches</span>
              </li>
            </ul>
            <p className={`mt-7 ${siteBodySemiboldClass}`}>
              Afroliya vous simplifie la vie.
            </p>
            <Link
              href="/restaurants"
              className={`mt-8 ${siteButtonPrimaryClass}`}
            >
              Trouver un restaurant
            </Link>
          </div>

          <div
            className={`${siteSectionMediaFirstClass} overflow-hidden rounded-2xl border border-neutral-200 shadow-sm sm:rounded-3xl`}
          >
            <img
              src="/images/Restaurant sénégalais Bruxelles.webp"
              alt="Restaurant africains à Bruxelles"
              className={siteSectionColumnImageTallSmClass}
            />
          </div>
        </div>
      </section>

      <section className={siteSectionMutedClass}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <h2 className={siteHeading2Class}>
              Pourquoi passer par Afroliya ?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {plaisirBlocks.map((block) => {
              const Icon = block.icon

              return (
                <article
                  key={block.title}
                  className={`${siteCardOnMutedClass} shadow-sm sm:p-7`}
                >
                  <div className="inline-flex rounded-xl bg-stone-100 p-2.5 text-brand">
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  <h3 className={`mt-4 ${siteHeading3Class}`}>
                    {block.title}
                  </h3>
                  <p className={`mt-3 ${siteBodyRelaxedClass}`}>
                    {block.description}
                  </p>

                  <Link
                    href="/restaurants"
                    className={`mt-6 ${siteButtonPrimarySmClass}`}
                  >
                    Trouver un restaurant
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={siteSectionWhiteClass}>
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div
            className={`${siteSectionMediaFirstClass} overflow-hidden rounded-3xl border border-neutral-200/80`}
          >
            <img
              src="/images/famille restaurant.webp"
              alt="Famille profitant d'un repas dans un restaurant africain à Bruxelles"
              className={siteSectionColumnImageClass}
            />
          </div>

          <div className={siteSectionContentSecondClass}>
            <h2 className={`mt-2 ${siteHeading2LeadingClass}`}>
              Ils ont déjà adopté Afroliya
            </h2>

            <PlatformStatsList />

            <Link
              href="/restaurants"
              className={`mt-8 ${siteButtonPrimaryClass}`}
            >
              Trouver un restaurant
            </Link>
          </div>
        </div>
      </section>

      <GuidesTeaserSection
        guides={latestGuides}
        title="Découvrez nos guides thématiques"
      />

      <CommunitySignupSection />

      <SiteFooter />
    </main>
  )
}
