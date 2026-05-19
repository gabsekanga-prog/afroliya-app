import Link from 'next/link'

import { restaurantPageTextLinkClass } from '@/lib/restaurant-page-link'
import {
  siteBodyClass,
  siteFooterColumnTitleClass,
  siteFooterLabelClass,
  siteHeading2Class,
  siteSectionPaddingClass,
} from '@/lib/site-styles'

const footerLinkClass = restaurantPageTextLinkClass

export function SiteFooter() {
  return (
    <footer
      id="liens-utiles"
      className={`scroll-mt-24 border-t border-neutral-200 bg-stone-100 ${siteSectionPaddingClass}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className={siteHeading2Class}>Liens utiles</h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className={siteFooterColumnTitleClass}>La plateforme</h3>
            <ul className={`mt-4 space-y-2 ${siteBodyClass}`}>
              <li>
                <Link href="/" className={footerLinkClass}>
                  Le concept
                </Link>
              </li>
              <li>
                <Link
                  href="/restaurants"
                  className={footerLinkClass}
                >
                  Trouver un restaurant
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className={footerLinkClass}
                >
                  Guides thématiques
                </Link>
              </li>
              <li>
                <a
                  href="/#communaute"
                  className={footerLinkClass}
                >
                  Rejoindre la communauté
                </a>
              </li>
              <li>
                <Link href="#" className={footerLinkClass}>
                  Suggérer un resto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={siteFooterColumnTitleClass}>Partenaires</h3>
            <ul className={`mt-4 space-y-2 ${siteBodyClass}`}>
              <li>
                <Link
                  href="/devenir-partenaire"
                  className={footerLinkClass}
                >
                  Devenir partenaire
                </Link>
              </li>
              <li>
                <Link href="#" className={footerLinkClass}>
                  Nos offres
                </Link>
              </li>
              <li>
                <Link href="#" className={footerLinkClass}>
                  Espace resto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={siteFooterColumnTitleClass}>À propos</h3>
            <ul className={`mt-4 space-y-2 ${siteBodyClass}`}>
              <li>
                <Link href="#" className={footerLinkClass}>
                  Nous contacter
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@afroliya.be"
                  className={footerLinkClass}
                >
                  contact@afroliya.be
                </a>
              </li>
              <li>
                <a
                  href="tel:+32456880787"
                  className={footerLinkClass}
                >
                  +32 456 88 07 87
                </a>
              </li>
              <li>
                <Link href="#" className={footerLinkClass}>
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-neutral-300 pt-6">
          <span className={siteFooterLabelClass}>Réseaux sociaux :</span>
          <a
            href="#"
            aria-label="Instagram"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-brand transition hover:border-[#c9a882] hover:bg-[#f5e6d9]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-brand transition hover:border-[#c9a882] hover:bg-[#f5e6d9]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-[18px] w-[18px]"
              fill="currentColor"
            >
              <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.3l.7-3H13V9c0-.6.4-1 1-1z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
