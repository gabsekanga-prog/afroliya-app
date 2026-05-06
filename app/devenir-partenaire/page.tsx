import Link from 'next/link'
import {
  BadgeEuro,
  CalendarClock,
  Layers,
  Megaphone,
  type LucideIcon,
} from 'lucide-react'
import { SiteFooter } from '../components/site-footer'

const benefits: {
  title: string
  description: string
  points: string[]
  icon: LucideIcon
}[] = [
  {
    title: 'Réservation en ligne',
    description:
      'Ne ratez plus aucune réservation, même en plein rush ou quand vous êtes fermé.',
    icon: CalendarClock,
    points: [
      'Réservation 24h/24',
      'Alertes en temps réel (SMS et e-mail)',
      'Rappels automatiques (réduction des no-shows)',
      'Intégration sur Google, site web, réseaux...',
    ],
  },
  {
    title: 'Solution tout compris',
    description:
      "On s'occupe de la technique, concentrez-vous sur votre métier.",
    icon: Layers,
    points: [
      'Site web et nom de domaine',
      'Hébergement et référencement (SEO)',
      'Module de réservation',
      'Menu digital (QR code)',
      'Maintenance & support 7j/7',
    ],
  },
  {
    title: 'Tarifs plus justes',
    description:
      'Protégez vos marges, loin des frais abusifs de certaines solutions.',
    icon: BadgeEuro,
    points: [
      'Réservation sans commission',
      'Abonnement fixe, sans surprise',
      'Sans engagement : arrêtez quand vous voulez',
    ],
  },
  {
    title: 'Boost marketing',
    description: 'Augmentez la visibilité de votre restaurant africain.',
    icon: Megaphone,
    points: [
      'Référencement sur la plateforme 100% afro',
      'Touchez +500 passionnés chaque semaine',
      'Mise en avant (guides, newsletter, réseaux...)',
      'Construisez votre propre base clients',
    ],
  },
]

const offers = [
  {
    name: 'Afroliya Free - Gratuit',
    subtitle: 'Boostez votre visibilité.',
    cta: 'Inscrire votre resto',
    points: [
      'Page vitrine : référencement sur la plateforme',
      'Touchez des centaines de passionnés chaque semaine',
      'Réservation par téléphone (sur votre numéro)',
      'Sans engagement : arrêtez quand vous voulez',
    ],
  },
  {
    name: 'Afroliya Pro - Sur demande',
    subtitle: 'Optimisez votre remplissage.',
    cta: 'Demander un devis',
    points: [
      'Tout le pack Free',
      'Réservation en ligne, 24h/24, sans commission',
      'Mise en avant (guides, réseaux, newsletter...)',
      'Site web et nom de domaine',
      'Hébergement et référencement (SEO)',
      'Module de réservation',
      'Menu digital (QR code)',
      'Maintenance et support 7j/7',
    ],
  },
]

export default function DevenirPartenairePage() {
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
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Concept
            </Link>
            <Link
              href="/reserver-un-restaurant"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Reserver un resto
            </Link>
            <span className="rounded-full bg-[#f5e6d9] px-4 py-2 text-[#8D5524]">
              Devenir partenaire
            </span>
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
              <Link
                href="/"
                className="block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Concept
              </Link>
              <Link
                href="/reserver-un-restaurant"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Reserver un resto
              </Link>
              <span className="mt-1 block rounded-xl bg-[#f5e6d9] px-4 py-2 text-lg font-normal text-[#8D5524]">
                Devenir partenaire
              </span>
            </div>
          </details>
        </div>
      </header>

      <section className="w-full bg-[#2a1810] pb-0">
        <div className="relative overflow-hidden">
          <img
            src="/images/Restauratrice%20resto%20afro%20gestion%20digital%20r%C3%A9servations%20couple%20clients.jpg"
            alt="Restauratrice gérant les réservations digitales de son restaurant afro"
            className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/30" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-bold leading-tight sm:text-5xl">
                  Recevez des réservations en ligne dans votre restaurant africain
                </h1>
                <p className="mt-4 text-lg text-[#f8e9dc]">
                  Attirez des clients 24h/24 — Réduisez vos coûts — Optimisez le
                  remplissage
                </p>
                <Link
                  href="#form-partenaire"
                  className="mt-8 inline-flex h-12 min-w-[230px] items-center justify-center rounded-xl bg-[#8D5524] px-6 text-lg font-normal text-white transition hover:bg-[#74431a]"
                >
                  Devenir partenaire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#f8f1ea] py-14 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
              Sans réservation en ligne, votre restaurant rate des clients
            </h2>
            <ul className="mt-6 space-y-2 text-neutral-600 sm:text-lg">
              <li>✖︎ Beaucoup n aiment plus appeler</li>
              <li>✖︎ Dépendance aux horaires</li>
              <li>✖︎ Répondeur et appels manqués</li>
              <li>✖︎ Faible visibilité en ligne</li>
            </ul>
            <p className="mt-6 font-semibold text-neutral-600 sm:text-lg">
              Avec Afroliya, recevez des réservations en ligne et attirez des
              clients 24h/24.
            </p>
          </div>
          <img
            src="/images/Restaurant%20s%C3%A9n%C3%A9galais%20Bruxelles.webp"
            alt="Restaurant africain tables en attente"
            className="h-[320px] w-full rounded-2xl border border-neutral-200 object-cover shadow-sm"
          />
        </div>
      </section>

      <section className="w-full bg-white py-14 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
            Comment Afroliya optimise votre remplissage ?
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {benefits.map((item) => {
            const Icon = item.icon

            return (
            <article
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-7"
            >
              <div className="inline-flex rounded-xl bg-stone-100 p-2.5 text-brand">
                <Icon size={20} strokeWidth={2} />
              </div>

              <h3 className="mt-4 text-xl font-bold text-neutral-900">{item.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-neutral-600 sm:text-lg">
                {item.description}
              </p>
              <ul className="mt-4 space-y-2 text-lg text-neutral-600">
                {item.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <Link
                href="#form-partenaire"
                className="mt-6 inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
              >
                Devenir partenaire
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
              alt="Afroliya chez Africalicious à Bruxelles"
              className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold leading-tight text-neutral-900 sm:text-4xl">
              On optimise déjà le remplissage des restaurants africains
            </h2>

            <div className="mt-8 space-y-5">
              <article className="border-l-2 border-neutral-300 pl-4 sm:pl-5">
                <p className="text-3xl font-bold text-neutral-900 sm:text-4xl">+50</p>
                <p className="mt-1 text-lg text-neutral-600 sm:text-base">
                  Couverts réservés chaque semaine
                </p>
              </article>

              <article className="border-l-2 border-neutral-300 pl-4 sm:pl-5">
                <p className="text-3xl font-bold text-neutral-900 sm:text-4xl">+60%</p>
                <p className="mt-1 text-lg text-neutral-600 sm:text-base">
                  Réservations en dehors des heures d ouverture
                </p>
              </article>

              <article className="border-l-2 border-neutral-300 pl-4 sm:pl-5">
                <p className="text-3xl font-bold text-neutral-900 sm:text-4xl">+500</p>
                <p className="mt-1 text-lg text-neutral-600 sm:text-base">
                  Passionnés sur la plateforme chaque semaine
                </p>
              </article>
            </div>

            <Link
              href="#form-partenaire"
              className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
            >
              Devenir partenaire
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-14 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
          Nos offres de partenariat
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.name}
              className="rounded-2xl border border-neutral-200 bg-stone-50/80 p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-neutral-900">{offer.name}</h3>
              <p className="mt-2 text-neutral-600">{offer.subtitle}</p>
              <ul className="mt-4 space-y-2 text-lg text-neutral-600">
                {offer.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <button className="mt-6 rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]">
                {offer.cta}
              </button>
            </article>
          ))}
        </div>
        </div>
      </section>

      <section
        id="form-partenaire"
        className="w-full bg-[#f8f1ea] py-16 pb-24 sm:py-20 sm:pb-32"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Démarrons la collaboration
          </h2>

          <form className="mt-10 flex max-w-lg flex-col gap-6">
            <label className="flex flex-col gap-1.5 text-lg font-bold text-neutral-800">
              Restaurant
              <input
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-lg font-normal text-neutral-900 placeholder:text-lg placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                type="text"
                name="restaurant"
                required
                placeholder="Nom du restaurant"
                autoComplete="organization"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-lg font-bold text-neutral-800">
              Offre souhaitée
              <select
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-lg font-normal text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                name="offer"
                required
              >
                <option value="free">Afroliya Free</option>
                <option value="pro">Afroliya Pro</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-lg font-bold text-neutral-800">
              Nom et prénom
              <input
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-lg font-normal text-neutral-900 placeholder:text-lg placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                type="text"
                name="name"
                required
                placeholder="Votre nom"
                autoComplete="name"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-lg font-bold text-neutral-800">
              Téléphone
              <input
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-lg font-normal text-neutral-900 placeholder:text-lg placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                type="tel"
                name="phone"
                required
                placeholder="+32 …"
                autoComplete="tel"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-lg font-bold text-neutral-800">
              E-mail
              <input
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-lg font-normal text-neutral-900 placeholder:text-lg placeholder:text-neutral-500 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                type="email"
                name="email"
                required
                placeholder="vous@exemple.com"
                autoComplete="email"
              />
            </label>
            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a] sm:w-auto sm:self-start"
            >
              Envoyer
            </button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
