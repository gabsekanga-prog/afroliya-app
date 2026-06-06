import type { Metadata } from 'next'
import Link from 'next/link'

import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { ContactForm } from '@/app/components/contact-form'
import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import {
  siteContactEmail,
  siteContactPhoneHref,
  siteContactPhoneLabel,
  siteSocialFacebookUrl,
  siteSocialInstagramUrl,
} from '@/lib/site-links'
import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import {
  siteBodyClass,
  siteCardOnWhiteClass,
  siteGuideIntroSectionClass,
  siteHeading1OnDarkClass,
  siteHeading3Class,
  siteSectionBgWhiteClass,
  siteSectionInnerClass,
  siteSectionTwoColumnGridClass,
  siteSubtitleLeadClass,
  siteTextLinkClass,
} from '@/lib/site-styles'

export const metadata: Metadata = {
  title: 'Nous contacter',
  description:
    'Contactez l’équipe Afroliya pour toute question sur les réservations, les guides ou le partenariat.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader />

      <section className={siteGuideIntroSectionClass}>
        <div className={siteSectionInnerClass}>
          <h1 className={siteHeading1OnDarkClass}>Nous contacter</h1>
          <p className={`max-w-3xl ${siteSubtitleLeadClass}`}>
            Une question, une idée ou un retour ? Écrivez-nous ou appelez-nous.
          </p>
        </div>
      </section>

      <section className={`w-full ${siteSectionBgWhiteClass} py-10 sm:py-14`}>
        <div className={siteSectionInnerClass}>
          <div className={`${siteSectionTwoColumnGridClass} lg:items-start`}>
            <ContactForm />

            <div className={`space-y-8 ${siteCardOnWhiteClass}`}>
              <div>
                <h2 className={siteHeading3Class}>Équipe Afroliya</h2>
                <ul className={`mt-4 space-y-3 ${siteBodyClass}`}>
                  <li>
                    <span className="font-semibold text-neutral-800">E-mail :</span>{' '}
                    <a href={`mailto:${siteContactEmail}`} className={siteTextLinkClass}>
                      {siteContactEmail}
                    </a>
                  </li>
                  <li>
                    <span className="font-semibold text-neutral-800">Téléphone :</span>{' '}
                    <a href={siteContactPhoneHref} className={siteTextLinkClass}>
                      {siteContactPhoneLabel}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className={siteHeading3Class}>Réseaux sociaux</h2>
                <ul className={`mt-4 space-y-2 ${siteBodyClass}`}>
                  <li>
                    <a
                      href={siteSocialInstagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={restaurantPageTextLinkClass}
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href={siteSocialFacebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={restaurantPageTextLinkClass}
                    >
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className={siteHeading3Class}>Autres demandes</h2>
                <ul className={`mt-4 space-y-2 ${siteBodyClass}`}>
                  <li>
                    <Link href="/suggerer-un-resto" className={restaurantPageTextLinkClass}>
                      Suggérer un restaurant à référencer
                    </Link>
                  </li>
                  <li>
                    <Link href="/devenir-partenaire" className={restaurantPageTextLinkClass}>
                      Devenir partenaire restaurant
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CommunitySignupSection />

      <SiteFooter />
    </main>
  )
}
