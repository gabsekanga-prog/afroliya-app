 'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Clock3, MapPin, ShieldCheck, Wallet } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SiteFooter } from './components/site-footer'

const plaisirBlocks = [
  {
    title: 'Réservation 24h/24',
    description:
      'Bloquez votre table en quelques clics, quand vous voulez, sans dépendre des horaires, et sans devoir rappeler 5x.',
    icon: Clock3,
  },
  {
    title: '100% gratuit',
    description:
      'Certaines plateformes vous demandent des acomptes et facturent des commissions. Chez Afroliya, vous ne payez aucun frais.',
    icon: Wallet,
  },
  {
    title: "Moins d'imprévus",
    description:
      'En réservant, vous permettez au restaurant d anticiper votre venue et de réduire les imprévus : attente, ruptures de stock, lenteurs.',
    icon: ShieldCheck,
  },
  {
    title: 'Plus de découvertes',
    description:
      'Ne tournez plus en rond avec les mêmes adresses. Explorez de nouvelles saveurs afro grâce à notre catalogue mis à jour régulièrement.',
    icon: MapPin,
  },
]

const stats = [
  {
    value: 50,
    prefix: '+',
    suffix: '',
    label: 'Couverts réservés chaque semaine',
  },
  {
    value: 60,
    prefix: '+',
    suffix: '%',
    label: "Réservations en dehors des heures d'ouverture",
  },
  {
    value: 500,
    prefix: '+',
    suffix: '',
    label: 'Passionnés sur la plateforme chaque semaine',
  },
]

function CountUp({
  target,
  duration = 1300,
  prefix = '',
  suffix = '',
}: {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || hasStarted) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [duration, hasStarted, target])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

export default function HomePage() {
  const [communityEmail, setCommunityEmail] = useState('')
  const [communityMessage, setCommunityMessage] = useState('')
  const [communityMessageType, setCommunityMessageType] = useState<
    'success' | 'error' | null
  >(null)
  const [isSubmittingCommunity, setIsSubmittingCommunity] = useState(false)

  const handleCommunitySubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const normalizedEmail = communityEmail.trim().toLowerCase()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(normalizedEmail)) {
      setCommunityMessage('Veuillez entrer une adresse e-mail valide.')
      setCommunityMessageType('error')
      return
    }

    setIsSubmittingCommunity(true)
    setCommunityMessage('')
    setCommunityMessageType(null)

    const { error: insertError } = await supabase
      .from('newsletter')
      .insert({ email: normalizedEmail })

    if (insertError) {
      if (insertError.code === '23505') {
        setCommunityMessage('Vous êtes déjà membre de la communauté.')
        setCommunityMessageType('error')
      } else if (
        insertError.code === '42501' ||
        insertError.message.toLowerCase().includes('row-level security')
      ) {
        setCommunityMessage(
          "Configuration Supabase requise : autorisez l'insertion anonyme dans la table newsletter.",
        )
        setCommunityMessageType('error')
      } else {
        setCommunityMessage("Une erreur est survenue. Merci de réessayer.")
        setCommunityMessageType('error')
      }
      setIsSubmittingCommunity(false)
      return
    }

    setCommunityMessage('Bienvenue dans la communauté Afroliya.')
    setCommunityMessageType('success')
    setCommunityEmail('')
    setIsSubmittingCommunity(false)
  }

  return (
    <main className="min-h-screen bg-[#f8f1ea] text-[#2f1d12]">
      <header className="relative z-50 border-b border-[#e8d6c8] bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" aria-label="Aller a la page Concept">
            <img
              src="/logo/Afroliya-logo-mini-rectangle.png"
              alt="Afroliya"
              className="h-8 w-auto sm:h-9"
            />
          </Link>
          <nav className="hidden items-center gap-2 text-lg font-normal sm:flex">
            <span className="rounded-full bg-[#f5e6d9] px-4 py-2 text-[#8D5524]">
              Concept
            </span>
            <Link
              href="/reserver-un-restaurant"
              className="rounded-full px-4 py-2 text-[#8D5524] transition hover:bg-[#f5e6d9]"
            >
              Reserver un restaurant
            </Link>
            <Link
              href="/devenir-partenaire"
              className="rounded-full px-4 py-2 text-[#8D5524] transition hover:bg-[#f5e6d9]"
            >
              Devenir partenaire
            </Link>
          </nav>

          <details className="group relative sm:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-[#d9c2ae] bg-white text-[#8D5524] [&::-webkit-details-marker]:hidden">
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
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#e8d6c8] bg-white p-2 shadow-lg">
              <span className="block rounded-xl bg-[#f5e6d9] px-4 py-2 text-lg font-normal text-[#8D5524]">
                Concept
              </span>
              <Link
                href="/reserver-un-restaurant"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-[#8D5524] transition hover:bg-[#f5e6d9]"
              >
                Reserver un restaurant
              </Link>
              <Link
                href="/devenir-partenaire"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-[#8D5524] transition hover:bg-[#f5e6d9]"
              >
                Devenir partenaire
              </Link>
            </div>
          </details>
        </div>
      </header>

      <section className="w-full pb-8 sm:pb-20">
        <div className="relative overflow-hidden">
          <img
            src="/images/Couple%20manger%20restaurant%20africain.jpg"
            alt="Couple profitant d un repas dans un restaurant africain"
            className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/30" />

          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-bold leading-tight sm:text-5xl">
                Réservez vos restaurants africains a Bruxelles et autour
                </h1>
                <p className="mt-4 text-[#f8e9dc]">
                  Bloquez votre table 24h/24 — Évitez les imprévus — Maximisez le
                  plaisir.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/reserver-un-restaurant"
                    className="inline-flex h-12 min-w-[230px] items-center justify-center rounded-xl bg-[#8D5524] px-6 text-lg font-normal text-white transition hover:bg-[#74431a]"
                  >
                    Réserver un restaurant
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-12 min-w-[230px] items-center justify-center rounded-xl border border-white/60 px-6 text-lg font-normal text-white transition hover:bg-white/15"
                  >
                    Rejoindre la communauté
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-24">
        <div className="grid items-center gap-10 rounded-3xl border border-[#e8d6c8] bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-12">
          <div className="order-2 lg:order-2">
            <h2 className="text-2xl font-bold leading-tight text-[#8D5524] sm:text-4xl">
              Tomber sur des imprévus peut gâcher votre plaisir...
            </h2>
            <ul className="mt-7 space-y-3 text-base text-[#6d4c35] sm:text-lg">
              <li>✖︎ Attente pour une table</li>
              <li>✖︎ Ruptures de stock</li>
              <li>✖︎ Staff en sous-effectif</li>
              <li>✖︎ Service plus lent</li>
            </ul>
            <p className="mt-7 text-base font-bold text-[#6d4c35] sm:text-lg">
              Avec Afroliya, évitez les imprévus et maximisez le plaisir.
            </p>
            <Link
              href="/reserver-un-restaurant"
              className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
            >
              Réserver un restaurant
            </Link>
          </div>

          <div className="order-1 overflow-hidden rounded-2xl border border-[#e8d6c8] sm:rounded-3xl lg:order-1">
            <img
              src="/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp"
              alt="Restaurant sénégalais à Bruxelles"
              className="h-[300px] w-full object-cover sm:h-[380px] lg:h-[420px]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-24">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <h2 className="text-2xl font-bold text-[#8D5524] sm:text-4xl">
            Comment Afroliya maximise votre plaisir ?
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {plaisirBlocks.map((block) => {
            const Icon = block.icon

            return (
              <article
                key={block.title}
                className="rounded-2xl border border-[#e8d6c8] bg-white p-6 shadow-sm sm:p-7"
              >
                <div className="inline-flex rounded-xl bg-[#f5e6d9] p-2.5 text-[#8D5524]">
                  <Icon size={20} strokeWidth={2} />
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#8D5524]">{block.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-[#6d4c35] sm:text-lg">
                  {block.description}
                </p>

                <Link
                  href="/reserver-un-restaurant"
                  className="mt-6 inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
                >
                  Réserver un restaurant
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-24">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-3xl">
            <img
              src="/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp"
              alt="Ambiance chaleureuse dans un restaurant africain partenaire"
              className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          <div>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-[#8D5524] sm:text-4xl">
              On maximise déjà le plaisir de plein de passionnés
            </h2>

            <div className="mt-8 space-y-5">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className="border-l-2 border-[#d8b89e] pl-4 sm:pl-5"
                >
                  <p className="text-3xl font-bold text-[#8D5524] sm:text-4xl">
                    <CountUp
                      target={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="mt-1 text-lg text-[#6d4c35] sm:text-base">{stat.label}</p>
                </article>
              ))}
            </div>

            <Link
              href="/reserver-un-restaurant"
              className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
            >
              Réserver un restaurant
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-24">
        <div className="grid items-center gap-8 rounded-3xl bg-[#8D5524] px-6 py-10 text-white sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold sm:text-4xl">
                Rejoignez la communauté Afroliya
              </h2>
              <p className="mt-3 text-lg text-[#f8e9dc]">
                Découvrez des adresses — Profitez des promos — Participez à des concours
              </p>
            </div>

            <form className="mt-8 grid gap-4" onSubmit={handleCommunitySubmit}>
              <label className="flex flex-col gap-2 text-lg font-semibold text-[#f8e9dc]">
                E-mail
                <input
                  type="email"
                  value={communityEmail}
                  onChange={(event) => setCommunityEmail(event.target.value)}
                  placeholder="Entrez votre e-mail"
                  required
                  className="rounded-xl border border-[#f2d8c3]/50 bg-white px-4 py-3 font-normal text-[#2f1d12] outline-none transition focus:border-white focus:ring-2 focus:ring-white/30"
                />
              </label>

              <div>
                <button
                  type="submit"
                  disabled={isSubmittingCommunity}
                  className="inline-flex rounded-xl bg-white px-6 py-3 text-lg font-normal text-[#8D5524] transition hover:bg-[#f6e6d7]"
                >
                  {isSubmittingCommunity
                    ? 'Envoi en cours...'
                    : 'Rejoindre la communauté'}
                </button>
              </div>

              {communityMessage && (
                <p
                  className={`rounded-xl px-3 py-2 text-lg font-semibold ${
                    communityMessageType === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {communityMessage}
                </p>
              )}
            </form>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/20 shadow-md">
            <img
              src="/images/Nourriture%20congolaise.jpg"
              alt="Plat de nourriture congolaise"
              className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
