import type { Metadata } from 'next'

import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import { siteContactEmail } from '@/lib/site-links'
import {
  siteBodyClass,
  siteBodyRelaxedClass,
  siteGuideIntroSectionClass,
  siteHeading1OnDarkClass,
  siteHeading3Class,
  siteSectionBgWhiteClass,
  siteSectionInnerClass,
  siteTextLinkClass,
} from '@/lib/site-styles'

const editorEmail = 'gabsekanga@gmail.com'
const editorInstagramUrl = 'https://www.instagram.com/tonton.gabs/?hl=fr'
const editorFacebookUrl = 'https://www.facebook.com/gabsekanga'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales et conditions d’utilisation du site Afroliya.',
}

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader />

      <section className={siteGuideIntroSectionClass}>
        <div className={siteSectionInnerClass}>
          <h1 className={siteHeading1OnDarkClass}>Mentions légales</h1>
          <p className={`max-w-3xl ${siteBodyClass}`}>
            Conditions d&apos;utilisation et informations légales du site Afroliya.
          </p>
        </div>
      </section>

      <section className={`w-full ${siteSectionBgWhiteClass} py-10 sm:pb-16`}>
        <div className={`${siteSectionInnerClass} max-w-3xl space-y-10`}>
          <section>
            <h2 className={siteHeading3Class}>1. Éditeur du site</h2>
            <p className={`mt-4 ${siteBodyRelaxedClass}`}>
              Le site Afroliya est une initiative personnelle éditée par Gabs Ekanga, résidant à
              1050 Bruxelles, Belgique.
            </p>
            <p className={`mt-3 ${siteBodyRelaxedClass}`}>
              Contact :{' '}
              <a href={`mailto:${editorEmail}`} className={siteTextLinkClass}>
                {editorEmail}
              </a>
              {' · '}
              <a
                href={editorInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={siteTextLinkClass}
              >
                Instagram
              </a>
              {' · '}
              <a
                href={editorFacebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={siteTextLinkClass}
              >
                Facebook
              </a>
            </p>
            <p className={`mt-3 ${siteBodyRelaxedClass}`}>
              Statut : plateforme en phase de test conceptuel (projet pré-entrepreneurial sans
              activité commerciale au sens fiscal actuel).
            </p>
          </section>

          <section>
            <h2 className={siteHeading3Class}>2. Hébergement</h2>
            <p className={`mt-4 ${siteBodyRelaxedClass}`}>
              Le site est hébergé par le prestataire technique du déploiement en ligne (infrastructure
              cloud).
            </p>
          </section>

          <section>
            <h2 className={siteHeading3Class}>3. Nature du service</h2>
            <p className={`mt-4 ${siteBodyRelaxedClass}`}>
              Afroliya est une plateforme de mise en relation entre utilisateurs et restaurateurs.
              Le service est actuellement gratuit. Afroliya n&apos;intervient pas dans la transaction
              financière, qui s&apos;effectue exclusivement au sein de l&apos;établissement.
            </p>
          </section>

          <section>
            <h2 className={siteHeading3Class}>4. Limitation de responsabilité</h2>
            <p className={`mt-4 ${siteBodyRelaxedClass}`}>
              En tant qu&apos;intermédiaire, Afroliya transmet les demandes de réservation mais ne
              peut être tenu responsable de l&apos;exactitude des informations (menus, prix,
              horaires) fournies par les restaurants, de la non-disponibilité d&apos;une table, d&apos;un
              défaut de service de l&apos;établissement, ni de tout litige survenant lors de la
              prestation au restaurant.
            </p>
          </section>

          <section>
            <h2 className={siteHeading3Class}>5. Protection des données (RGPD)</h2>
            <p className={`mt-4 ${siteBodyRelaxedClass}`}>
              Les données personnelles collectées (nom, téléphone, e-mail) sont utilisées pour la
              gestion des réservations et la communication liée au service Afroliya. Conformément à
              la réglementation, vous pouvez exercer votre droit d&apos;accès ou de suppression en
              nous contactant à{' '}
              <a href={`mailto:${siteContactEmail}`} className={siteTextLinkClass}>
                {siteContactEmail}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className={siteHeading3Class}>6. Cookies</h2>
            <p className={`mt-4 ${siteBodyRelaxedClass}`}>
              Le site peut utiliser des cookies techniques nécessaires au fonctionnement, ainsi que
              des outils d&apos;analyse pour comprendre l&apos;usage du site. Vous pouvez les
              désactiver via les réglages de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className={siteHeading3Class}>7. Propriété intellectuelle</h2>
            <p className={`mt-4 ${siteBodyRelaxedClass}`}>
              Le nom « Afroliya », le logo, les textes et les photos originales sont la propriété de
              l&apos;éditeur. Certaines photos des plats et des établissements restent la propriété
              des restaurants partenaires.
            </p>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
