import type { Metadata } from 'next'

import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import { SuggestAddressSection } from '@/app/components/suggest-address-section'
import {
  siteBodyClass,
  siteGuideIntroSectionClass,
  siteHeading1OnDarkClass,
  siteSectionBgWhiteClass,
  siteSectionInnerClass,
  siteSubtitleLeadClass,
} from '@/lib/site-styles'

export const metadata: Metadata = {
  title: 'Suggérer un restaurant',
  description:
    'Proposez un restaurant afro à ajouter au catalogue Afroliya à Bruxelles et autour.',
}

export default function SuggererUnRestoPage() {
  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader />

      <section className={siteGuideIntroSectionClass}>
        <div className={siteSectionInnerClass}>
          <h1 className={siteHeading1OnDarkClass}>Suggérer un restaurant</h1>
          <p className={`max-w-3xl ${siteSubtitleLeadClass}`}>
            Vous connaissez une pépite qui n&apos;est pas encore sur Afroliya ? Dites-le nous.
          </p>
        </div>
      </section>

      <section className={`w-full ${siteSectionBgWhiteClass} py-10 sm:py-14`}>
        <div className={`${siteSectionInnerClass} max-w-2xl`}>
          <p className={siteBodyClass}>
            Chaque suggestion est lue par l&apos;équipe. Merci de préciser le nom du restaurant et
            son quartier.
          </p>
          <SuggestAddressSection variant="page" />
        </div>
      </section>

      <CommunitySignupSection />

      <SiteFooter />
    </main>
  )
}
