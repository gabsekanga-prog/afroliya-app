import Link from 'next/link'

import { CommunitySignupSection } from '@/app/components/community-signup-section'
import type { Guide, GuideSubsection } from '@/lib/guides'

function SubsectionButton({ item }: { item: GuideSubsection }) {
  const external =
    item.href.startsWith('http://') || item.href.startsWith('https://')

  const className =
    'mt-6 inline-flex w-fit rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]'

  if (external) {
    return (
      <a
        href={item.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.buttonLabel}
      </a>
    )
  }

  return (
    <Link href={item.href} className={className}>
      {item.buttonLabel}
    </Link>
  )
}

type Props = {
  guide: Guide
}

export function GuideStructuredContent({ guide }: Props) {
  return (
    <>
      {guide.intro ? (
        <p className="mt-6 text-lg leading-relaxed text-neutral-700 sm:mt-8">
          {guide.intro}
        </p>
      ) : null}

      <ul className="mt-10 list-none divide-y divide-neutral-200 border-t border-neutral-200 p-0 sm:mt-12">
        {guide.subsections.map((item, index) => (
          <li key={`${item.title}-${index}`} className="py-8 sm:py-10">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
              {item.title}
            </h2>

            <div className="relative mt-5 w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 sm:mt-6">
              <img
                src={item.imageSrc}
                alt={item.imageAlt}
                className="h-56 w-full object-cover sm:h-72 md:h-80"
              />
            </div>

            <p className="mt-5 text-lg leading-relaxed text-neutral-600 sm:mt-6">
              {item.description}
            </p>

            <SubsectionButton item={item} />
          </li>
        ))}

        {guide.subsections.length === 0 ? (
          <li className="py-8 sm:py-10">
            <p className="text-lg text-neutral-600">
              Les détails de ce guide seront publiés prochainement.
            </p>
          </li>
        ) : null}

        <li className="py-8 sm:py-10">
          <CommunitySignupSection variant="guide" />
        </li>
      </ul>
    </>
  )
}
