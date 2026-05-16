'use client'

import Link from 'next/link'
import { AlertCircle, CalendarCheck, MapPin, ShieldCheck, Target, Utensils } from 'lucide-react'
import type { Guide } from '@/lib/guides'
import { CommunitySignupSection } from './community-signup-section'
import { PlatformStatsList } from './platform-stats-list'
import { SiteFooter } from './site-footer'

const plaisirBlocks = [
  {
    title: 'Découvrez des adresses',
    description:
      'Ne tournez plus en rond avec les mêmes adresses. Découvrez facilement de nouvaux restaurants afro et antillais grâce à notre catalogue mise à jour régulièrement.',
    icon: Target,
  },

  {
    title: 'Réservez 24h/24',
    description:
      'Bloquez votre table en quelques clics, gratuitement, sans dépendre des horaires, et sans devoir rappeler 5x.',
    icon: CalendarCheck,
  },
  {
    title: 'Réduisez les imprévus',
    description:
      'Signalez vos plats et boissons préférés à l\'avance afin de réduire les imprévus (attente, rupture de stock, etc.).',
    icon: AlertCircle,
  }
]

type Props = {
  guides: Guide[]
}

export function HomePageClient({ guides }: Props) {
  return (
    <main className="min-h-screen text-neutral-900">
      <header className="relative z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" aria-label="Aller a la page Concept">
            <img
              src="/logo/Afroliya-logo-mini-rectangle.png"
              alt="Afroliya"
              className="h-9 w-auto sm:h-10"
            />
          </Link>
          <nav className="hidden items-center gap-2 text-lg font-normal sm:flex">
            <span className="rounded-full bg-[#f5e6d9] px-4 py-2 text-[#8D5524]">
              Concept
            </span>
            <Link
              href="/restaurants"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Trouver un restaurant
            </Link>
            <Link
              href="/devenir-partenaire"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Devenir partenaire
            </Link>
            <a
              href="#liens-utiles"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Liens utiles
            </a>
          </nav>

          <details className="group relative sm:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-neutral-300 bg-white text-brand transition hover:border-[#c9a882] [&::-webkit-details-marker]:hidden">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 group-open:hidden"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="hidden h-5 w-5 group-open:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </summary>
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
              <span className="block rounded-xl bg-[#f5e6d9] px-4 py-2 text-lg font-normal text-[#8D5524]">
                Concept
              </span>
              <Link
                href="/restaurants"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Trouver un restaurant
              </Link>
              <Link
                href="/devenir-partenaire"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Devenir partenaire
              </Link>
              <a
                href="#liens-utiles"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Liens utiles
              </a>
            </div>
          </details>
        </div>
      </header>

      <section className="w-full bg-[#2a1810] pb-0 sm:pb-0">
        <div className="relative overflow-hidden">
          <img
            src="/images/Couple%20manger%20restaurant%20africain.jpg"
            alt="Couple profitant d un repas dans un restaurant africain"
            className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/30" />

          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6">
              <div>
                <h1 className="text-2xl max-w-3xl font-bold leading-tight sm:text-5xl">
                Votre plateforme des restos afro à Bruxelles et autour
                </h1>
                <p className="mt-4 text-lg text-[#f8e9dc]">
                  Découvrez des adresses — Réservez 24h/24 — Réduisez les imprévus
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/restaurants"
                    className="inline-flex h-12 min-w-[230px] items-center justify-center rounded-xl bg-[#8D5524] px-6 text-lg font-normal text-white transition hover:bg-[#74431a]"
                  >
                    Trouver un restaurant
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#f8f1ea] py-14 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-2">
            <h2 className="text-2xl font-bold leading-tight text-neutral-900 sm:text-4xl">
              Ne gâchez plus vos sorties dans les restos afro...
            </h2>
            <ul className="mt-7 space-y-3 text-base text-neutral-600 sm:text-lg">
              <li>✖︎ Ne pas savoir où manger</li>
              <li>✖︎ Perdre du temps à chercher sur Google, Instagram, etc.</li>
              <li>✖︎ Devoir rappeler 5x pour réserver une table</li>
              <li>✖︎ Tomber sur des imprévus (attente, rupture de stock, etc.)</li>
            </ul>
            <p className="mt-7 text-base font-bold text-neutral-600 sm:text-lg">
              Afroliya vous évite ces soucis.
            </p>
            <Link
              href="/restaurants"
              className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
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

      <section className="w-full bg-white py-14 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
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

                  <h3 className="mt-4 text-xl font-bold text-neutral-900">
                    {block.title}
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-neutral-600 sm:text-lg">
                    {block.description}
                  </p>

                  <Link
                    href="/restaurants"
                    className="mt-6 inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
                  >
                    Trouver un resto
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-stone-100 py-14 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-3xl border border-neutral-200/80">
            <img
              src="/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp"
              alt="Ambiance chaleureuse dans un restaurant africain partenaire"
              className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          <div>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-neutral-900 sm:text-4xl">
              On est là pour vous simplifier la vie
            </h2>

            <PlatformStatsList />

            <Link
              href="/restaurants"
              className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
            >
              Trouver un restaurant
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-14 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="w-full">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
              Nos guides thématiques
            </h2>
            <p className="mt-4 text-lg text-neutral-600">Explorez des restaurants afro selon vos envies</p>
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
                    <h3 className="text-xl font-bold leading-snug text-white">
                      {guide.title}
                    </h3>
                    <span className="mt-3 inline-flex text-lg font-semibold text-[#f8e9dc] underline-offset-4 group-hover:underline">
                      Lire le guide
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-lg text-neutral-600">
              Les guides seront bientôt en ligne.
            </p>
          )}

          <div className="mt-10 flex justify-center sm:justify-start">
            <Link
              href="/guides"
              className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
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
