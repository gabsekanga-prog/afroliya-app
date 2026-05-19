/**
 * Typographie publique Afroliya (référence PC, breakpoint lg: 1024px).
 * Mobile + tablette : titres −1 vs PC ; corps −1 vs PC (tablette = PC dès md:).
 */

/** H1 hero — PC text-5xl, mobile/tablette text-4xl */
export const siteHeading1Class = 'text-4xl font-bold leading-tight lg:text-5xl'

export const siteHeading1OnDarkClass =
  'text-4xl font-bold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] lg:text-5xl'

/** H1 de page (bandeau clair) — PC text-4xl, mobile/tablette text-3xl */
export const siteHeading1PageClass =
  'text-3xl font-bold leading-tight text-neutral-900 lg:text-4xl'

/** H2 de section — PC text-4xl, mobile/tablette text-3xl */
export const siteHeading2Class = 'text-3xl font-bold text-neutral-900 lg:text-4xl'

export const siteHeading2LeadingClass =
  'text-3xl font-bold leading-tight text-neutral-900 lg:text-4xl'

/** H3 — PC text-2xl, mobile/tablette text-xl */
export const siteHeading3Class = 'text-xl font-bold text-neutral-900 lg:text-2xl'

/** Titre sur fond sombre (cartes guides) — PC text-xl, mobile/tablette text-lg */
export const siteHeading3OnDarkClass =
  'text-lg font-bold leading-snug text-white lg:text-xl'

/** Colonnes footer / labels de groupe — PC text-lg, mobile/tablette text-base */
export const siteFooterColumnTitleClass =
  'text-base font-semibold uppercase tracking-wide text-neutral-800 md:text-lg'

export const siteFooterLabelClass =
  'text-base font-semibold text-neutral-800 md:text-lg'

/** Chiffres / stats — PC text-4xl, mobile/tablette text-3xl */
export const siteStatValueClass = 'text-3xl font-bold text-neutral-900 lg:text-4xl'

/** Corps — PC text-lg, mobile text-base ; tablette = PC dès md */
export const siteBodyClass = 'text-base text-neutral-600 md:text-lg'

export const siteBodyRelaxedClass =
  'text-base leading-relaxed text-neutral-600 md:text-lg'

export const siteBodyBoldClass = 'text-base font-bold text-neutral-600 md:text-lg'

export const siteBodySemiboldClass =
  'text-base font-semibold text-neutral-600 md:text-lg'

export const siteBodyOnDarkClass = 'text-base md:text-lg text-neutral-700'

/** Hero marketing (fond sombre) */
export const siteHeroSectionClass = 'w-full bg-[#2a1810] pb-0'

export const siteHeroInnerClass =
  'mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6'

export const siteHeroLeadOnDarkClass = 'mt-4 text-base md:text-lg text-[#f8e9dc]'

export const siteHeroBreadcrumbOnDarkClass =
  'flex flex-wrap items-center gap-x-2 text-base md:text-lg text-[#f8e9dc]'

export const siteHeroMetaOnDarkClass =
  'text-base md:text-lg text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)]'

/** Navigation */
export const siteNavClass = 'hidden items-center gap-2 sm:flex text-base font-normal md:text-lg'

export const siteNavItemClass =
  'rounded-full px-4 py-2 text-base text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524] md:text-lg'

export const siteNavItemActiveClass =
  'rounded-full bg-[#f5e6d9] px-4 py-2 text-base text-[#8D5524] md:text-lg'

export const siteMobileNavItemClass =
  'block rounded-xl px-4 py-2 text-base font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524] md:text-lg'

export const siteMobileNavItemActiveClass =
  'block rounded-xl bg-[#f5e6d9] px-4 py-2 text-base font-normal text-[#8D5524] md:text-lg'

export const siteMobileNavItemSpacedClass =
  'mt-1 block rounded-xl px-4 py-2 text-base font-normal text-neutral-800 transition hover:bg-[#f5e6d9] hover:text-[#8D5524] md:text-lg'

export const siteMobileNavItemActiveSpacedClass =
  'mt-1 block rounded-xl bg-[#f5e6d9] px-4 py-2 text-base font-normal text-[#8D5524] md:text-lg'

/** Boutons CTA (texte) */
export const siteButtonPrimaryClass =
  'inline-flex items-center justify-center rounded-xl bg-[#8D5524] px-6 py-3 text-base font-normal text-white transition hover:bg-[#74431a] md:text-lg'

export const siteButtonPrimarySmClass =
  'inline-flex items-center justify-center rounded-xl bg-[#8D5524] px-5 py-2.5 text-base font-normal text-white transition hover:bg-[#74431a] md:text-lg'

export const siteCtaOnDarkClass =
  'mt-3 inline-flex text-base font-semibold text-[#f8e9dc] underline-offset-4 hover:underline md:text-lg'

/** Sections */
export const siteSectionPaddingClass = 'py-14 sm:py-24'

export const siteSectionInnerClass = 'mx-auto w-full max-w-6xl px-4 sm:px-6'

export const siteGuideIntroSectionClass = 'w-full bg-[#f8f1ea] py-10 sm:py-14'

export const siteGuideListSectionClass = 'w-full bg-white py-12 sm:py-16'

export const restaurantContentSectionClass = `scroll-mt-24 w-full border-t border-neutral-200/80 ${siteSectionPaddingClass}`
