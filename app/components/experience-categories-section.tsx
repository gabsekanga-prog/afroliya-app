import Link from 'next/link'

import { experienceCategoryCards } from '@/lib/experience-categories'
import {
  siteBodyRelaxedClass,
  siteHeading2Class,
  siteHeading3Class,
  siteSectionWhiteClass,
  siteTextLinkInCardClass,
} from '@/lib/site-styles'

type GridProps = {
  className?: string
}

export function ExperienceCategoriesGrid({ className = '' }: GridProps) {
  return (
    <div
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 ${className}`.trim()}
    >
      {experienceCategoryCards.map((category) => (
        <Link
          key={category.title}
          href={category.href}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a882]/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5524]"
        >
          <div className="overflow-hidden">
            <img
              src={category.imageSrc}
              alt={category.imageAlt}
              className="aspect-[16/10] h-auto w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
            <h3 className={siteHeading3Class}>{category.title}</h3>
            <p className={`flex-1 ${siteBodyRelaxedClass}`}>
              {category.description}
            </p>
            <span className={siteTextLinkInCardClass}>{category.cta}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function ExperienceCategoriesSection() {
  return (
    <section className={siteSectionWhiteClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className={siteHeading2Class}>
          Des expériences afro inoubliables
        </h2>
        <ExperienceCategoriesGrid className="mt-10" />
      </div>
    </section>
  )
}
