'use client'

import Link from 'next/link'
import { CalendarCheck, MapPin, StarIcon } from 'lucide-react'
import {
  siteBodyClass,
  siteBodyBoldClass,
  siteBodyRelaxedClass,
  siteButtonPrimaryClass,
  siteButtonPrimarySmClass,
  siteHeading2Class,
  siteHeading2LeadingClass,
  siteHeading3Class,
  siteSectionContentSecondClass,
  siteSectionMediaFirstClass,
  siteSectionMutedClass,
  siteSectionWhiteClass,
} from '@/lib/site-styles'

import { CommunitySignupSection } from './community-signup-section'
import { ExperienceCategoriesSection } from './experience-categories-section'
import { MarketingSplitHero } from './marketing-split-hero'
import { PlatformStatsList } from './platform-stats-list'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

const plaisirBlocks = [
  {
    title: 'Restos, events, activités',
    description:
      'Ne perdez plus de temps à chercher partout. Nous rassemblons plein d\'expériences afro au même endroit : restos, événements et activités.',
    icon: MapPin,
  },
  {
    title: 'Sélection de qualité',
    description:
      'Nous dénichons et sélectionnons pour vous la crème de la crème des expériences afro en Belgique.',
    icon: StarIcon,
  },
  {
    title: 'Achat et réservation',
    description:
      'Bloquez vos tables ou sécurisez vos tickets en quelques clics, sans vous casser la tête.',
    icon: CalendarCheck,
  }
]

export function HomePageClient() {
  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader active="concept" />

      <MarketingSplitHero
        imageSrc="/images/Activités afro bruxelles et autour.webp"
        imageAlt="Activités afro en Belgique"
        title="La plateforme d'expériences afro en Belgique"
        lead="Restos, events, activités | Sélection de qualité | Réservation et achat"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/trouver-une-experience"
            className={`${siteButtonPrimaryClass} h-12 min-w-[230px]`}
          >
            Trouver une expérience
          </Link>
        </div>
      </MarketingSplitHero>
      <section className={siteSectionWhiteClass}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div className={siteSectionContentSecondClass}>
            <h2 className={siteHeading2LeadingClass}>
              Vous passez des heures à chercher des expériences afro ?
            </h2>
            <ul className={`mt-7 space-y-3 ${siteBodyClass}`}>
              <li>✖︎ Devoir parcourir plein d'applications et plateformes</li>
              <li>✖︎ S'abonner à des dizaines de comptes sur Instagram et TikTok</li>
              <li>✖︎ Rejoindre des dizaines de groupes Facebook et WhatsApp</li>
            </ul>
            <p className={`mt-7 ${siteBodyBoldClass}`}>
              Afroliya vous simplifie la vie.
            </p>
            <Link
              href="/trouver-une-experience"
              className={`mt-8 ${siteButtonPrimaryClass}`}
            >
              Trouver une expérience
            </Link>
          </div>

          <div
            className={`${siteSectionMediaFirstClass} overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:rounded-3xl`}
          >
            <img
              src="/images/Food festival.webp"
              alt="Festival de street-food afro à Bruxelles"
              className="h-[300px] w-full object-cover sm:h-[380px] lg:h-[420px]"
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
                    href="/trouver-une-experience"
                    className={`mt-6 ${siteButtonPrimarySmClass}`}
                  >
                    Trouver une expérience
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <ExperienceCategoriesSection />

      <section className={siteSectionMutedClass}>
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div
            className={`${siteSectionMediaFirstClass} overflow-hidden rounded-3xl border border-neutral-200/80`}
          >
            <img
              src="/images/Couple manger restaurant africain.jpg"
              alt="Couple profitant d'un repas dans un restaurant africain"
              className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          <div className={siteSectionContentSecondClass}>
            <h2 className={`mt-2 ${siteHeading2LeadingClass}`}>
              Ils ont déjà adopté Afroliya
            </h2>

            <PlatformStatsList />

            <Link
              href="/trouver-une-experience"
              className={`mt-8 ${siteButtonPrimaryClass}`}
            >
              Trouver une expérience
            </Link>
          </div>
        </div>
      </section>

      <CommunitySignupSection tone="white" />

      <SiteFooter />
    </main>
  )
}
