import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-stone-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold text-neutral-900">Liens utiles</h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide text-neutral-800">
              La plateforme
            </h3>
            <ul className="mt-4 space-y-2 text-lg text-neutral-600">
              <li>
                <Link href="/" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Le concept
                </Link>
              </li>
              <li>
                <Link
                  href="/reserver-un-restaurant"
                  className="text-neutral-600 hover:text-[#8D5524] hover:underline"
                >
                  Réserver un resto
                </Link>
              </li>
              <li>
                <a
                  href="/#communaute"
                  className="text-neutral-600 hover:text-[#8D5524] hover:underline"
                >
                  Rejoindre la communauté
                </a>
              </li>
              <li>
                <Link href="#" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Suggérer un resto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide text-neutral-800">
              Nos contenus
            </h3>
            <ul className="mt-4 space-y-2 text-lg text-neutral-600">
              <li>
                <Link href="/blog" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Notre blog
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-neutral-600 hover:text-[#8D5524] hover:underline"
                >
                  Guides thématiques
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Bons plans
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide text-neutral-800">
              Partenaires
            </h3>
            <ul className="mt-4 space-y-2 text-lg text-neutral-600">
              <li>
                <Link
                  href="/devenir-partenaire"
                  className="text-neutral-600 hover:text-[#8D5524] hover:underline"
                >
                  Devenir partenaire
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Nos offres
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Espace resto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide text-neutral-800">
              À propos
            </h3>
            <ul className="mt-4 space-y-2 text-lg text-neutral-600">
              <li>
                <Link href="#" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Nous contacter
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@afroliya.be"
                  className="text-neutral-600 hover:text-[#8D5524] hover:underline"
                >
                  contact@afroliya.be
                </a>
              </li>
              <li>
                <a
                  href="tel:+32456880787"
                  className="text-neutral-600 hover:text-[#8D5524] hover:underline"
                >
                  +32 456 88 07 87
                </a>
              </li>
              <li>
                <Link href="#" className="text-neutral-600 hover:text-[#8D5524] hover:underline">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-neutral-300 pt-6">
          <span className="text-lg font-semibold text-neutral-800">
            Réseaux sociaux :
          </span>
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
