import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GuideStructuredContent } from '@/app/components/guide-structured-content'
import { MarketingSplitHero } from '@/app/components/marketing-split-hero'
import { SiteBreadcrumb } from '@/app/components/site-breadcrumb'
import { fetchGuideBySlug, fetchPublishedGuides } from '@/lib/guides'
import { siteButtonPrimaryClass } from '@/lib/site-styles'

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
      <MarketingSplitHero
        imageSrc={guide.imageSrc}
        imageAlt={guide.imageAlt}
        title={guide.title}
        breadcrumb={
          <SiteBreadcrumb
            tone="onDark"
            items={[
              { label: 'Guides thématiques', href: '/guides' },
              { label: guide.title },
            ]}
          />
        }
      />

      <section className="w-full flex-1 bg-white pb-16 pt-6 sm:pb-20 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GuideStructuredContent guide={guide} />

          <div className="mt-12 flex flex-wrap gap-4 border-t border-neutral-200 pt-10">
            <Link href="/restaurants" className={siteButtonPrimaryClass}>
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
