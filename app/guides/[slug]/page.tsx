import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GuideStructuredContent } from '@/app/components/guide-structured-content'
import { fetchGuideBySlug, fetchPublishedGuides } from '@/lib/guides'

type Params = { slug: string }

export const revalidate = 120

export async function generateStaticParams() {
  const guides = await fetchPublishedGuides()
  return guides.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = await fetchGuideBySlug(slug)
  if (!guide) return { title: 'Guide | Afroliya' }
  return {
    title: `${guide.title} | Afroliya`,
    description: guide.intro?.trim() || guide.title,
  }
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const guide = await fetchGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  return (
    <>
      <section className="w-full bg-[#2a1810] pb-0">
        <div className="relative overflow-hidden">
          <img
            src={guide.imageSrc}
            alt={guide.imageAlt}
            className="h-[360px] w-full object-cover sm:h-[420px] lg:h-[500px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2f1d12]/80 via-[#2f1d12]/55 to-[#2f1d12]/35" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6 sm:py-10">
              <nav
                aria-label="Fil d'Ariane"
                className="flex flex-wrap items-center gap-x-2 text-lg text-[#f8e9dc]"
              >
                <Link href="/guides" className="hover:text-white hover:underline">
                  Guides thématiques
                </Link>
                <span aria-hidden className="text-white/50">
                  /
                </span>
                <span className="text-white/90" aria-current="page">
                  {guide.title}
                </span>
              </nav>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                {guide.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full flex-1 bg-white pb-16 pt-6 sm:pb-20 sm:pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <GuideStructuredContent guide={guide} />

          <div className="mt-12 flex flex-wrap gap-4 border-t border-neutral-200 pt-10">
            <Link
              href="/restaurants"
              className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"
            >
              Réserver un restaurant
            </Link>
            <Link
              href="/guides"
              className="inline-flex rounded-xl border border-neutral-300 bg-white px-6 py-3 text-lg font-normal text-neutral-800 transition hover:bg-neutral-50"
            >
              Tous les guides
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
