import type { ReactNode } from 'react'

import { SiteChecklist } from '@/app/components/site-checklist'
import {
  siteHeading1HeroClass,
  siteMarketingSplitHeroContentClass,
  siteMarketingSplitHeroContentWrapClass,
  siteMarketingSplitHeroGridClass,
  siteMarketingSplitHeroImageClass,
  siteMarketingSplitHeroImageWrapClass,
  siteMarketingSplitHeroLeadClass,
  siteMarketingSplitHeroSectionClass,
} from '@/lib/site-styles'

type Props = {
  imageSrc: string
  imageAlt: string
  title: string
  lead?: string
  intro?: ReactNode
  breadcrumb?: ReactNode
  checklistItems?: string[]
  imagePriority?: boolean
  children?: ReactNode
}

export function MarketingSplitHero({
  imageSrc,
  imageAlt,
  title,
  lead,
  intro,
  breadcrumb,
  checklistItems,
  imagePriority = false,
  children,
}: Props) {
  return (
    <section className={siteMarketingSplitHeroSectionClass}>
      <div className={siteMarketingSplitHeroGridClass}>
        <div className={siteMarketingSplitHeroContentWrapClass}>
          <div className={siteMarketingSplitHeroContentClass}>
            {breadcrumb}
            <h1 className={`${breadcrumb ? 'mt-4' : ''} ${siteHeading1HeroClass}`}>
              {title}
            </h1>
            {intro ?? (lead ? <p className={siteMarketingSplitHeroLeadClass}>{lead}</p> : null)}
            {checklistItems && checklistItems.length > 0 ? (
              <SiteChecklist items={checklistItems} />
            ) : null}
            {children}
          </div>
        </div>

        <div className={siteMarketingSplitHeroImageWrapClass}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className={siteMarketingSplitHeroImageClass}
            fetchPriority={imagePriority ? 'high' : undefined}
          />
        </div>
      </div>
    </section>
  )
}
