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
  Utensils,
  type LucideIcon,
} from 'lucide-react'
import { SiteHeader } from '@/app/components/site-header'
import {
  siteBodyClass,
  siteBodyRelaxedClass,
  siteBodySemiboldClass,
  siteButtonPrimaryClass,
  siteButtonPrimarySmClass,
  siteHeading1Class,
  siteHeading2Class,
  siteHeading2LeadingClass,
  siteHeading3Class,
  siteHeroInnerClass,
  siteHeroLeadOnDarkClass,
  siteHeroSectionClass,
  siteSectionPaddingClass,
} from '@/lib/site-styles'

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
    icon: Utensils
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
      <SiteHeader active="partenaire" />

      <section className={siteHeroSectionClass}>
        <div className="relative overflow-hidden">
          <img
            src="/images/Restauratrice%20resto%20afro%20gestion%20digital%20r%C3%A9servations%20couple%20clients.jpg"
            alt="Restauratrice gérant les réservations digitales de son restaurant afro"
            className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/30" />

          <div className="absolute inset-0 flex items-center">
            <div className={siteHeroInnerClass}>
              <div>
                <h1 className={`${siteHeading1Class} max-w-5xl`}>
                  Le partenaire marketing de votre restaurant africain et antillais
                </h1>
                <p className={siteHeroLeadOnDarkClass}>
                  Touchez des milliers de passionnés — Recevez des réservations sans commission — Obtenez vos propres outils digitaux
                </p>
                <Link
                  href="#offres-partenaire"
                  className={`mt-8 ${siteButtonPrimaryClass} h-12 min-w-[230px]`}
                >
                  Devenir partenaire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`w-full bg-[#f8f1ea] ${siteSectionPaddingClass}`}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className={siteHeading2Class}>
              Votre restaurant rencontre-t-il l'un de ces problèmes ?
            </h2>
            <ul className={`mt-6 space-y-2 pl-6 ${siteBodyClass}`}>
              <li>✖︎ Peu de nouveaux clients</li>
              <li>✖︎ Fréquentation irrégulière</li>
              <li>✖︎ Coûts marketing élevés</li>
              <li>✖︎ Dépendance aux outils tiers (Uber, TheFork, etc.)</li>
            </ul>
            <p className={`mt-6 ${siteBodySemiboldClass}`}>
              Ne mettez plus votre activité en danger.
            </p>
            <Link
              href="#offres-partenaire"
              className={`mt-8 ${siteButtonPrimaryClass}`}
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

      <section className={`w-full bg-white ${siteSectionPaddingClass}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h2 className={siteHeading2Class}>
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

              <h3 className={`mt-4 ${siteHeading3Class}`}>{item.title}</h3>
              <p className={`mt-3 ${siteBodyRelaxedClass}`}>
                {item.description}
              </p>
              <Link
                href="#offres-partenaire"
                className={`mt-6 ${siteButtonPrimarySmClass}`}
              >
                Devenir partenaire
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
              alt="Afroliya chez Africalicious à Bruxelles"
              className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          <div>
            <h2 className={siteHeading2LeadingClass}>
              Nous sommes là pour vous donner un coup de main
            </h2>

            <PlatformStatsList />

            <Link
              href="#offres-partenaire"
              className={`mt-8 ${siteButtonPrimaryClass}`}
            >
              Devenir partenaire
            </Link>
          </div>
        </div>
      </section>

      <section
        id="offres-partenaire"
        className={`w-full scroll-mt-24 bg-white ${siteSectionPaddingClass}`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className={siteHeading2Class}>
          Nos offres de partenariat
        </h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.name}
              className="rounded-2xl border border-neutral-200 bg-stone-50/80 p-6 shadow-sm"
            >
              <h3 className={siteHeading3Class}>{offer.name}</h3>
              <p className={`mt-2 ${siteBodyClass}`}>{offer.subtitle}</p>
              <div className="mt-4 border-t border-neutral-200" aria-hidden />
              <ul className="mt-4 space-y-2 ${siteBodyClass}">
                {offer.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <Link
                href="#form-partenaire"
                className={`mt-6 ${siteButtonPrimarySmClass}`}
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
          <h2 className={siteHeading2Class}>
            Démarrons la collaboration
          </h2>

          <PartnerApplicationForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
