import Link from 'next/link'

import {
  siteMobileNavItemActiveClass,
  siteMobileNavItemActiveSpacedClass,
  siteMobileNavItemClass,
  siteMobileNavItemSpacedClass,
  siteNavClass,
  siteNavItemActiveClass,
  siteNavItemClass,
} from '@/lib/site-styles'

export type SiteHeaderActivePage = 'concept' | 'restaurants' | 'partenaire'

type Props = {
  /** Page courante mise en avant dans le menu ; omis = aucun lien actif */
  active?: SiteHeaderActivePage
}

export function SiteHeader({ active }: Props) {
  const restaurantsListIsLink = active !== 'restaurants'

  return (
    <header className="relative z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" aria-label="Aller à la page d'accueil">
          <img
            src="/logo/Afroliya-logo-mini-rectangle.png"
            alt="Afroliya"
            className="h-9 w-auto sm:h-10"
          />
        </Link>
        <nav className={siteNavClass}>
          {active === 'concept' ? (
            <span className={siteNavItemActiveClass}>Concept</span>
          ) : (
            <Link href="/" className={siteNavItemClass}>
              Concept
            </Link>
          )}
          {restaurantsListIsLink ? (
            <Link href="/restaurants" className={siteNavItemClass}>
              Trouver un restaurant
            </Link>
          ) : (
            <span className={siteNavItemActiveClass}>Trouver un restaurant</span>
          )}
          {active === 'partenaire' ? (
            <span className={siteNavItemActiveClass}>Devenir partenaire</span>
          ) : (
            <Link href="/devenir-partenaire" className={siteNavItemClass}>
              Devenir partenaire
            </Link>
          )}
          <a href="#liens-utiles" className={siteNavItemClass}>
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
            {active === 'concept' ? (
              <span className={siteMobileNavItemActiveClass}>Concept</span>
            ) : (
              <Link href="/" className={siteMobileNavItemClass}>
                Concept
              </Link>
            )}
            {restaurantsListIsLink ? (
              <Link href="/restaurants" className={siteMobileNavItemSpacedClass}>
                Trouver un restaurant
              </Link>
            ) : (
              <span className={siteMobileNavItemActiveSpacedClass}>
                Trouver un restaurant
              </span>
            )}
            {active === 'partenaire' ? (
              <span className={siteMobileNavItemActiveSpacedClass}>Devenir partenaire</span>
            ) : (
              <Link href="/devenir-partenaire" className={siteMobileNavItemSpacedClass}>
                Devenir partenaire
              </Link>
            )}
            <a href="#liens-utiles" className={siteMobileNavItemSpacedClass}>
              Liens utiles
            </a>
          </div>
        </details>
      </div>
    </header>
  )
}
