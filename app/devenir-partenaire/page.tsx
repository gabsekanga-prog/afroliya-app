import Link from 'next/link'
import {
  BadgeEuro,
  CalendarClock,
  Computer,
  GlobeIcon,
  LaptopIcon,
  Layers,
  Megaphone,
  Target,
  TargetIcon,
  type LucideIcon,
} from 'lucide-react'
import { PartnerApplicationForm } from '../components/partner-application-form'
import { PlatformStatsList } from '../components/platform-stats-list'
import { SiteFooter } from '../components/site-footer'

const benefits: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: 'Touchez des milliers de passionnés',
    description: 'Soyez référencé sur notre plateforme 100% afro et touchez chaque semaine des centaines de passionnés réellement intéressés par la cuisine afro et antillaise.',
    icon: TargetIcon
  },
  {
    title: 'Recevez des réservations sans commission',
    description:
      "Soyez réservable en ligne 24h/24. Ne ratez plus aucune réservation, même en plein rush ou quand vous êtes fermé. Protégez vos marges, loin des frais abusifs de certaines plateformes.",
    icon: CalendarClock
  },
  {
    title: 'Obtenez vos propres outils digitaux',
    description:
      'Ne subissez plus la loi des plateformes tierces. Obtenez tout ce qu\'il vous faut pour attirer des clients en ligne : site web, nom de domaine, référencement, réservation, menu digital (QR code), base de données de clients, etc.',
    icon: GlobeIcon
  }
]

const offers = [
  {
    name: 'Basique - Gratuit',
    subtitle: 'Pour une visibilité de base',
    cta: 'Inscrire votre resto',
    points: [
      'Référencement sur la plateforme',
      'Page vitrine professionnelle (infos, photos, menu, etc.)',
      'Touchez des centaines de passionnés chaque semaine',
      'Réservation par téléphone (sur votre numéro)',
      'Sans engagement : arrêtez quand vous voulez',
    ],
  },
  {
    name: 'Standard - 29€/mois',
    subtitle: 'Pour booster votre visibilité',
    cta: 'Choisir l\'offre',
    points: [
      'Tout le pack Basique',
      'Réservation en ligne, 24h/24, sans commission',
      'Widget de réservation pour votre site web',
      'Liens de réservation sur Google, Instagram, Facebook, etc.',
      'Mise en avant dans les résultats de recherche sur la plateforme',
      'Mise en avant régulière sur nos guides et newsletters',
      'Publications régulières sur nos réseaux sociaux'
    ],
  },
  {
    name: 'Premium - 59€/mois',
    subtitle: 'Pour une présence en ligne optimale',
    cta: 'Choisir l\'offre',
    points: [
      'Tout le pack Standard',
      'Site web et nom de domaine',
      'Hébergement et référencement (SEO)',
      'Design optimisé pour les smartphones',
      'Menu digital + QR codes sur vos tables',
      'Base de données de clients',
      'Optimisation de la fiche Google My Business',
      'Gestion clé en main : on s\'occupe de tout le côté technique',
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
              href="/restaurants"
              className="rounded-full px-4 py-2 text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
            >
              Trouver un restaurant
            </Link>
            <span className="rounded-full bg-[#f5e6d9] px-4 py-2 text-[#8D5524]">
              Devenir partenaire
            </span>
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
              <Link
                href="/"
                className="block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Concept
              </Link>
              <Link
                href="/restaurants"
                className="mt-1 block rounded-xl px-4 py-2 text-lg font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524]"
              >
                Trouver un restaurant
              </Link>
              <span className="mt-1 block rounded-xl bg-[#f5e6d9] px-4 py-2 text-lg font-normal text-[#8D5524]">
                Devenir partenaire
              </span>
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
            src="/images/Restauratrice%20resto%20afro%20gestion%20digital%20r%C3%A9servations%20couple%20clients.jpg"
            alt="Restauratrice gérant les réservations digitales de son restaurant afro"
            className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/30" />

          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6">
              <div>
                <h1 className="text-2xl font-bold leading-tight sm:text-5xl max-w-4xl">
                  Le partenaire marketing de votre restaurant afro et antillais
                </h1>
                <p className="mt-4 text-lg text-[#f8e9dc]">
                  Touchez des milliers de passionnés — Recevez des réservations sans commission — Obtenez vos propres outils digitaux
                </p>
                <Link
                  href="#offres-partenaire"
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
              Un marketing inefficace peut mettre votre activité en danger...
            </h2>
            <ul className="mt-6 space-y-2 pl-5 text-neutral-600 sm:pl-6 sm:text-lg">
              <li>✖︎ Manque de visibilité</li>
              <li>✖︎ Coûts marketing élevés</li>
              <li>✖︎ Peu de nouveaux clients</li>
              <li>✖︎ Forte dépendance (Uber, TheFork, etc.)</li>
            </ul>
            <p className="mt-6 font-semibold text-neutral-600 sm:text-lg">
              Afroliya est la solution qu'il vous faut.
            </p>
            <Link
              href="#offres-partenaire"
              className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
            >
              Devenir partenaire
            </Link>
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
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
            Boostez votre activité avec Afroliya
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
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
              <Link
                href="#offres-partenaire"
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
              Nous sommes là pour vous donner un coup de main
            </h2>

            <PlatformStatsList />

            <Link
              href="#offres-partenaire"
              className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
            >
              Devenir partenaire
            </Link>
          </div>
        </div>
      </section>

      <section
        id="offres-partenaire"
        className="w-full scroll-mt-24 bg-white py-14 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
          Nos offres de partenariat
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.name}
              className="rounded-2xl border border-neutral-200 bg-stone-50/80 p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-neutral-900">{offer.name}</h3>
              <p className="mt-2 text-lg text-neutral-600">{offer.subtitle}</p>
              <div className="mt-4 border-t border-neutral-200" aria-hidden />
              <ul className="mt-4 space-y-2 text-base text-neutral-600">
                {offer.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <Link
                href="#form-partenaire"
                className="mt-6 inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"
              >
                {offer.cta}
              </Link>
            </article>
          ))}
        </div>
        </div>
      </section>

      <section
        id="form-partenaire"
        className="w-full scroll-mt-24 bg-[#f8f1ea] py-16 pb-24 sm:py-20 sm:pb-32"
      >
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-4xl">
            Démarrons la collaboration
          </h2>

          <PartnerApplicationForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
