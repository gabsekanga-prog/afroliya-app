import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Afroliya',
  description:
    'Articles et sélections Afroliya : guides thématiques, nouvelles et bons plans autour des restaurants africains.',
}

export default function BlogPage() {
  const themes = [
    {
      title: 'Guides thématiques',
      description:
        'Sélections par pays, ambiance et quartiers pour découvrir les restaurants afro à Bruxelles et autour.',
      href: '/guides',
      cta: 'Voir les guides',
      available: true,
      imageSrc: '/images/Restaurant-So-Yiri-plats.webp',
      imageAlt: 'Plats servis dans un restaurant africain',
    },
    {
      title: 'Bons plans',
      description:
        'Nos meilleures recommandations pour profiter de restos afro à prix malin.',
      href: '/blog',
      cta: 'Bientôt disponible',
      available: false,
      imageSrc: '/images/Plats-afro-riz-poulet-bananes-sauce.jpg',
      imageAlt: 'Bon plan autour de plats afro',
    },
    {
      title: 'Actualités',
      description:
        'Actualités Afroliya, annonces partenaires et nouveautés de la plateforme.',
      href: '/blog',
      cta: 'Bientôt disponible',
      available: false,
      imageSrc: '/images/Restaurant-So-Yiri-plats.webp',
      imageAlt: 'Assiette afro avec riz, poulet et bananes',
    },
  ] as const

  return (
    <>
      <section className="w-full bg-[#f8f1ea] py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav
            aria-label="Fil d'Ariane"
            className="flex flex-wrap items-center gap-x-2 text-lg text-neutral-600"
          >
            <span className="font-semibold text-neutral-900" aria-current="page">
              Blog
            </span>
          </nav>
          <h1 className="mt-6 text-3xl font-bold text-neutral-900 sm:text-4xl">
            Découvrez le blog d'Afroliya
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-neutral-600">
            Explorez des guides thématiques — Profitez des bons plans — Soyez au
            courant des actualités
          </p>
        </div>
      </section>

      <section className="w-full bg-white py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <article
                key={theme.title}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
              >
                <img
                  src={theme.imageSrc}
                  alt={theme.imageAlt}
                  className="h-48 w-full object-cover"
                />
                <div className="p-6 sm:p-7">
                  <h2 className="text-2xl font-bold text-neutral-900">{theme.title}</h2>
                  <p className="mt-3 text-lg text-neutral-600">{theme.description}</p>
                  {theme.available ? (
                    <Link
                      href={theme.href}
                      className="mt-6 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
                    >
                      {theme.cta}
                    </Link>
                  ) : (
                    <span className="mt-6 inline-flex rounded-xl border border-neutral-300 bg-neutral-100 px-6 py-3 text-lg font-normal text-neutral-600">
                      {theme.cta}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
