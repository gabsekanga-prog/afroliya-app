import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BadgeEuro,
  CalendarClock,
  Computer,
  CogIcon,
  LaptopIcon,
  Layers,
  MegaphoneIcon,
  Utensils,
  type LucideIcon,
  TargetIcon,
  KeySquare,
  Smile,
  Heart,
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
  sitePainPointItemClass,
  sitePainPointsListClass,
  siteSectionBgWhiteClass,
  siteSectionContentFirstClass,
  siteSectionContentSecondClass,
  siteCardOnMutedClass,
  siteCardOnWhiteClass,
  siteSectionColumnImageClass,
  siteSectionMediaFirstClass,
  siteSectionMediaSecondClass,
  siteSectionMutedClass,
  siteSectionWhiteClass,
} from '@/lib/site-styles'

import { MarketingSplitHero } from '../components/marketing-split-hero'
import { PartnerApplicationForm } from '../components/partner-application-form'
import { PlatformStatsList } from '../components/platform-stats-list'
import { SiteFooter } from '../components/site-footer'

export const metadata: Metadata = {
  title: 'Devenir partenaire',
  description:
    'Boostez la visibilité de votre restaurant africain avec Afroliya : audience ciblée, réservation sans commission, accompagnement marketing.',
}

const benefits: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: "Des milliers d'utilisateurs passionnés",
    description: 'Ne payez plus pour atteindre un public généraliste. Touchez chaque semaine des centaines de passionnés de cuisine afro.',
    icon: Heart
  },
  {
    title: 'Des réservations sans commission',
    description:
      "Recevez des réservations 24h/24, même en plein rush ou quand vous êtes fermé. Le tout sans commission pour protéger vos marges.",
    icon: CalendarClock
  },
  {
    title: 'Une gestion sans prise de tête',
    description:
      "On s'occupe de tout, de la création de votre page vitrine à la mise en avant dans nos guides, newsletters et réseaux sociaux. Ça ne vous demande aucun effort.",
    icon: Smile
  }
]

const offers = [
  {
    name: 'Standard - Gratuit',
    subtitle: 'Soyez visible sur Afroliya',
    cta: 'Choisir l\'offre',
    points: [
      'Référencement complet sur la plateforme',
      'Page vitrine dédiée (infos, photos, menu, horaires)',
      'Visibilité auprès de centaines de passionnés chaque semaine',
      'Limité à 1 réservation par mois',
      'Rapport de statistiques mensuel',
      'Sans engagement : arrêtez quand vous voulez',
    ],
  },
  {
    name: 'Premium - 29€/mois',
    subtitle: 'Boostez votre visibilité et recevez des réservations',
    cta: 'Choisir l\'offre',
    points: [
      'Tout le pack Standard',
      'Priorité dans les résultats de recherche sur la plateforme',
      'Mise en avant dans nos guides thématiques et newsletters',
      'Création de contenus sur nos réseaux sociaux', 
      'Réservations illimitées et sans commission', 
      'Module de réservation intégrable sur votre site web',
      'Boutons de réservation sur vos profils Google, Instagram et Facebook'
    ],
  }
]

export default function DevenirPartenairePage() {
  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader active="partenaire" />

      <MarketingSplitHero
        imageSrc="/images/Restauratrice%20resto%20afro%20gestion%20digital%20r%C3%A9servations%20couple%20clients.jpg"
        imageAlt="Restauratrice gérant les réservations digitales de son restaurant afro"
        title="Boostez l'activité de votre restaurant africain"
        lead="Rejoignez la plateforme de réservation 100% afro."
        checklistItems={["Des milliers d'utilisateurs passionnés", "Des réservations sans commission", "Une gestion sans prise de tête"]}
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
            <ul className={`mt-6 space-y-2 ${sitePainPointsListClass}`}>
              <li className={sitePainPointItemClass}>
                <span className="shrink-0" aria-hidden>
                  ✖︎
                </span>
                <span>Un public généraliste et peu intéressé</span>
              </li>
              <li className={sitePainPointItemClass}>
                <span className="shrink-0" aria-hidden>
                  ✖︎
                </span>
                <span>Des coûts élevés et des commissions abusives</span>
              </li>
              <li className={sitePainPointItemClass}>
                <span className="shrink-0" aria-hidden>
                  ✖︎
                </span>
                <span>Trop d'efforts pour peu de résultats</span>
              </li>
            </ul>
            <p className={`mt-6 ${siteBodySemiboldClass}`}>
            Boostez l'activité de votre établissement avec Afroliya.
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
            className={`${siteSectionMediaSecondClass} ${siteSectionColumnImageClass} rounded-2xl border border-neutral-200 shadow-sm`}
          />
        </div>
      </section>

      <section
        id="avantages-partenaire"
        className={`w-full scroll-mt-24 ${siteSectionMutedClass}`}
      >
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
              className={`${siteCardOnMutedClass} shadow-sm sm:p-7`}
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

      <section
        id="chiffres-cles"
        className={`w-full scroll-mt-24 ${siteSectionWhiteClass}`}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <div
            className={`${siteSectionMediaFirstClass} overflow-hidden rounded-3xl border border-neutral-200/80`}
          >
            <img
              src="/images/Gabs-restaurant-africain-africalicious-Bruxelles_edited.webp"
              alt="Afroliya chez Africalicious à Bruxelles"
              className={siteSectionColumnImageClass}
            />
          </div>

          <div className={siteSectionContentSecondClass}>
            <h2 className={siteHeading2LeadingClass}>
              Une solution qui génère déjà des résultats
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
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.name}
              className={`${siteCardOnMutedClass} shadow-sm`}
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

          <div className={`mt-8 sm:mt-10 ${siteCardOnWhiteClass}`}>
            <PartnerApplicationForm />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
