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
  siteButtonOnDarkClass,
  siteButtonPrimaryClass,
  siteButtonPrimarySmClass,
  siteHeading2Class,
  siteHeading2LeadingClass,
  siteHeading3Class,
  siteSectionBgWhiteClass,
  siteSectionContentFirstClass,
  siteSectionContentSecondClass,
  siteSectionMediaFirstClass,
  siteSectionMediaSecondClass,
  siteSectionMutedClass,
  siteSectionWhiteClass,
} from '@/lib/site-styles'

import { MarketingSplitHero } from '../components/marketing-split-hero'
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
    description: 'Ne soyez plus noyé dans la masse des plateformes généralistes. Touchez chaque semaine des centaines de passionnés réellement intéressés par la cuisine afro et antillaise.',
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
      'Ne subissez plus la loi des plateformes tierces. Obtenez vos propres outils pour attirer des clients en ligne : site web, nom de domaine, référencement, réservation, menu digital (QR code), base de données de clients, etc.',
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

      <MarketingSplitHero
        imageSrc="/images/Restauratrice%20resto%20afro%20gestion%20digital%20r%C3%A9servations%20couple%20clients.jpg"
        imageAlt="Restauratrice gérant les réservations digitales de son restaurant afro"
        title="Boostez l'activité de votre restaurant africain"
        lead="Rejoignez la plateforme de restaurants africains à Bruxelles et alentours."
        checklistItems={[
          'Touchez des milliers de passionnés',
          'Recevez des réservations sans commission',
          'Obtenez vos propres outils digitaux',
        ]}
      >
        <Link
          href="#offres-partenaire"
          className={`mt-8 ${siteButtonOnDarkClass} h-12 min-w-[230px]`}
        >
          Devenir partenaire
        </Link>
      </MarketingSplitHero>

      <section className={siteSectionWhiteClass}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div className={siteSectionContentFirstClass}>
            <h2 className={siteHeading2Class}>
              Marre des solutions marketing inefficaces ?
            </h2>
            <ul className={`mt-6 space-y-2 pl-6 ${siteBodyClass}`}>
              <li>✖︎ Public généraliste et peu intéressé</li>
              <li>✖︎ Commisions et frais abusifs</li>
              <li>✖︎ Trop d'effort pour peu de résultats</li>
              <li>✖︎ Dépendance aux plateformes tierces</li>
            </ul>
            <p className={`mt-6 ${siteBodySemiboldClass}`}>
              Afroliya est la solution qu'il vous faut.
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
            className={`${siteSectionMediaSecondClass} h-[320px] w-full rounded-2xl border border-neutral-200 object-cover shadow-sm`}
          />
        </div>
      </section>

      <section className={siteSectionMutedClass}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h2 className={siteHeading2Class}>
            Comment Afroliya booste votre activité ?
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

      <section className={siteSectionWhiteClass}>
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div
            className={`${siteSectionMediaFirstClass} overflow-hidden rounded-3xl border border-neutral-200/80`}
          >
            <img
              src="/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp"
              alt="Afroliya chez Africalicious à Bruxelles"
              className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            />
          </div>

          <div className={siteSectionContentSecondClass}>
            <h2 className={siteHeading2LeadingClass}>
              On booste déjà l'activité des restaurants africains
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
        className={`w-full scroll-mt-24 ${siteSectionMutedClass}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
        className={`w-full scroll-mt-24 ${siteSectionBgWhiteClass} py-16 pb-24 sm:py-20 sm:pb-32`}
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
