'use client'

import Link from 'next/link'
import { AlertCircle, CalendarCheck, Clock, MapPin, ShieldCheck, Target, Utensils } from 'lucide-react'
import type { Guide } from '@/lib/guides'
import {
  siteBodyBoldClass,
  siteBodyClass,
  siteBodyRelaxedClass,
  siteButtonPrimaryClass,
  siteButtonPrimarySmClass,
  siteCtaOnDarkClass,
  siteHeading1Class,
  siteHeading2Class,
  siteHeading2LeadingClass,
  siteHeading3Class,
  siteHeading3OnDarkClass,
  siteHeroInnerClass,
  siteHeroLeadOnDarkClass,
  siteHeroSectionClass,
  siteSectionPaddingClass,
} from '@/lib/site-styles'

import { CommunitySignupSection } from './community-signup-section'
import { PlatformStatsList } from './platform-stats-list'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

const plaisirBlocks = [
  {
    title: 'Découvrez des adresses',
    description:
      'Ne perdez plus du temps à chercher. Découvrez facilement des restaurants africains et antillais grâce à notre catalogue mis à jour régulièrement.',
    icon: Utensils,
  },

  {
    title: 'Réservez 24h/24',
    description:
      'Bloquez votre table en quelques clics, gratuitement, quand vous voulez, sans dépendre des horaires, et sans devoir rappeler 5x.',
    icon: CalendarCheck,
  },
  {
    title: 'Réduisez l\'attente et les ruptures de stock',
    description:
      'Signalez vos plats et boissons préférés à l\'avance afin de réduire au maximum l\'attente et les ruptures de stock.',
    icon: Clock,
  }
]

type Props = {
  guides: Guide[]
}

export function HomePageClient({ guides }: Props) {
  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader active="concept" />

      <section className={siteHeroSectionClass}>
        <div className="relative overflow-hidden">
          <img
            src="/images/Couple%20manger%20restaurant%20africain.jpg"
            alt="Couple profitant d un repas dans un restaurant africain"
            className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/30" />

          <div className="absolute inset-0 flex items-center">
            <div className={siteHeroInnerClass}>
              <div>
                <h1 className={`${siteHeading1Class} max-w-5xl`}>
                Votre plateforme de restaurants africains à Bruxelles et autour
                </h1>
                <p className={siteHeroLeadOnDarkClass}>
                  Découvrez des adresses — Réservez 24h/24 — Réduisez l'attente et les ruptures de stock
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/restaurants"
                    className={`${siteButtonPrimaryClass} h-12 min-w-[230px]`}
                  >
                    Trouver un restaurant
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`w-full bg-[#f8f1ea] ${siteSectionPaddingClass}`}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-2">
            <h2 className={siteHeading2LeadingClass}>
              Avez-vous déjà rencontré l'un de ces problèmes ?
            </h2>
            <ul className={`mt-7 space-y-3 ${siteBodyClass}`}>
              <li>✖︎ Ne pas savoir où manger</li>
              <li>✖︎ Perdre du temps à chercher sur Google, Instagram, etc.</li>
              <li>✖︎ Devoir rappeler 5x pour réserver une table</li>
              <li>✖︎ Attente et ruptures de stock</li>
            </ul>
            <p className={`mt-7 ${siteBodyBoldClass}`}>
              Ne gâchez plus vos sorties au restaurant.
            </p>
            <Link
              href="/restaurants"
              className={`mt-8 ${siteButtonPrimaryClass}`}
            >
              Trouver un restaurant
            </Link>
          </div>

          <div className="order-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:rounded-3xl lg:order-1">
            <img
              src="/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp"
              alt="Restaurant sénégalais à Bruxelles"
              className="h-[300px] w-full object-cover sm:h-[380px] lg:h-[420px]"
            />
          </div>
        </div>
      </section>

      <section className={`w-full bg-white ${siteSectionPaddingClass}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <h2 className={siteHeading2Class}>
              Mangez afro sans prises de tête avec Afroliya
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {plaisirBlocks.map((block) => {
              const Icon = block.icon

              return (
                <article
                  key={block.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7"
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
                    Trouver un resto
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={`w-full bg-stone-100 ${siteSectionPaddingClass}`}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-3xl border border-neutral-200/80">
            <img
              src="/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp"
              alt="Ambiance chaleureuse dans un restaurant africain partenaire"
              className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          <div>
            <h2 className={`mt-2 ${siteHeading2LeadingClass}`}>
              On est là pour vous simplifier la vie
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

      <section className={`w-full bg-white ${siteSectionPaddingClass}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="w-full">
            <h2 className={siteHeading2Class}>
              Nos guides thématiques
            </h2>
            <p className={`mt-4 ${siteBodyClass}`}>Explorez des restaurants afro selon vos envies</p>
          </div>

          {guides.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
                    <h3 className={siteHeading3OnDarkClass}>
                      {guide.title}
                    </h3>
                    <span className={`${siteCtaOnDarkClass} group-hover:underline`}>
                      Lire le guide
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={`mt-8 ${siteBodyClass}`}>
              Les guides seront bientôt en ligne.
            </p>
          )}

          <div className="mt-10 flex justify-center sm:justify-start">
            <Link
              href="/guides"
              className={siteButtonPrimaryClass}
            >
              Voir tous les guides
            </Link>
          </div>
        </div>
      </section>

      <CommunitySignupSection />

      <SiteFooter />
    </main>
  )
}
