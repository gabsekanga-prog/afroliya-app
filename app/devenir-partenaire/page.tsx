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

const benefits: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: 'Visibilité ciblée',
    description: 'Ne payez plus pour atteindre un public généraliste. Touchez chaque semaine des centaines de passionnés de cuisine afro.',
    icon: MegaphoneIcon
  },
  {
    title: 'Réservation sans commission',
    description:
      "Recevez des réservations 24h/24, même en plein rush ou quand vous êtes fermé. Le tout sans commission pour protéger vos marges.",
    icon: CalendarClock
  },
  {
    title: 'On s\'occupe de tout',
    description:
      'Nous gérons tout, de la création de votre fiche dédiée à la mise en avant dans nos guides, newsletters et réseaux sociaux. Ça ne vous demande aucun effort.',
    icon: CogIcon
  }
]

const offers = [
  {
    name: 'Standard - Gratuit',
    subtitle: 'Soyez visible sur Afroliya',
    cta: 'Inscrire votre resto',
    points: [
      'Référencement complet sur la plateforme',
      'Page vitrine dédiée (infos, photos, menu, etc.)',
      'Visibilité auprès de centaines de passionnés chaque semaine',
      'Réservation par téléphone (bouton d\'appel direct)',
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
      'Module de réservation en ligne, sans commission',
      'Possibilité de transfert vers votre système (Zenchef, TheFork, etc.)'
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
        title="Le partenaire marketing de votre restaurant africain"
        lead="Visibilité ciblée | Réservation sans commission | On s'occupe de tout"
        checklistItems={[
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
              <li>✖︎ Coûts élevés et commissions abusives</li>
              <li>✖︎ Trop d'efforts pour peu de résultats</li>
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
            className={`${siteSectionMediaSecondClass} ${siteSectionColumnImageClass} rounded-2xl border border-neutral-200 shadow-sm`}
          />
        </div>
      </section>

      <section className={siteSectionMutedClass}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <h2 className={siteHeading2Class}>
            Pourquoi choisir Afroliya ?
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
