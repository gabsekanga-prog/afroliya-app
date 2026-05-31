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

/** Fond brun foncé chaud — tous les heros du site */
export const siteHeroDarkBgClass =
  'bg-gradient-to-br from-[#3d281c] via-[#322018] to-[#2a1810]'

/** Hero plein écran image (guides — overlay sombre conservé pour ce layout) */
export const siteHeroSectionClass = `w-full ${siteHeroDarkBgClass} pb-0`

/** Largeur max du contenu site — 80rem (1280px) */
export const siteMaxWidthClass = 'max-w-7xl'

export const siteHeroInnerClass =
  `mx-auto w-full ${siteMaxWidthClass} px-4 py-8 text-white sm:px-6`

/** Grille 2 colonnes — même espacement que les sections de page */
export const siteSectionTwoColumnGridClass =
  'grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12'

/** Fond heros (bandeau page liste, hub expériences, etc.) */
export const siteHeroBgClass = siteHeroDarkBgClass

/** Hero marketing 2 col. : fond brun foncé chaud, texte + image en colonne */
export const siteMarketingSplitHeroSectionClass =
  `relative w-full overflow-hidden ${siteHeroDarkBgClass} py-14 sm:py-20 lg:py-24`

export const siteMarketingSplitHeroGridClass = `relative z-10 mx-auto w-full ${siteMaxWidthClass} px-4 sm:px-6 ${siteSectionTwoColumnGridClass}`

export const siteMarketingSplitHeroImageWrapClass =
  'order-1 overflow-hidden rounded-2xl sm:rounded-3xl lg:order-2'

export const siteMarketingSplitHeroImageClass =
  'h-[280px] w-full object-cover sm:h-[360px] lg:h-[420px]'

export const siteMarketingSplitHeroContentWrapClass =
  'order-2 flex flex-col justify-center lg:order-1'

export const siteMarketingSplitHeroContentClass = 'max-w-2xl'

export const siteMarketingSplitHeroLeadClass =
  'mt-5 text-base font-bold leading-relaxed text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)] sm:mt-6 md:text-lg'

/** Sous-titre de section / hero : une ligne, segments séparés par « — » */
export const siteSubtitleLeadClass =
  'mt-5 text-base leading-relaxed text-neutral-600 sm:mt-6 md:text-lg font-bold'

export const siteSubtitleLeadOnDarkClass =
  'mt-5 text-base font-bold leading-relaxed text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)] sm:mt-6 md:text-lg'

export const siteHeroLeadOnDarkClass =
  'mt-4 max-w-3xl text-base text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)] md:text-lg'

export const siteHeroBreadcrumbOnDarkClass =
  'flex flex-wrap items-center gap-x-2 text-base md:text-lg text-[#f8e9dc]'

export const siteHeroMetaOnDarkClass =
  'text-base md:text-lg text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)]'

/** Navigation — hover et page active : souligné + couleur brand */
export const siteNavClass =
  'hidden items-center gap-6 sm:flex text-base font-normal md:text-lg md:gap-8'

export const siteNavItemClass =
  'text-neutral-800 underline-offset-4 transition hover:text-[#8D5524] hover:underline'

export const siteNavItemActiveClass =
  'text-[#8D5524] underline decoration-2 underline-offset-4'

export const siteMobileNavItemClass =
  'block rounded-lg px-3 py-2 text-base font-normal text-neutral-800 underline-offset-4 transition hover:text-[#8D5524] hover:underline md:text-lg'

export const siteMobileNavItemActiveClass =
  'block rounded-lg px-3 py-2 text-base font-normal text-[#8D5524] underline decoration-2 underline-offset-4 md:text-lg'

export const siteMobileNavItemSpacedClass =
  'mt-1 block rounded-lg px-3 py-2 text-base font-normal text-neutral-800 underline-offset-4 transition hover:text-[#8D5524] hover:underline md:text-lg'

export const siteMobileNavItemActiveSpacedClass =
  'mt-1 block rounded-lg px-3 py-2 text-base font-normal text-[#8D5524] underline decoration-2 underline-offset-4 md:text-lg'

/** Boutons CTA (texte) */
export const siteButtonPrimaryClass =
  'inline-flex items-center justify-center rounded-xl bg-[#8D5524] px-6 py-3 text-base font-normal text-white transition hover:bg-[#74431a] md:text-lg'

export const siteButtonPrimarySmClass =
  'inline-flex items-center justify-center rounded-xl bg-[#8D5524] px-5 py-2.5 text-base font-normal text-white transition hover:bg-[#74431a] md:text-lg'

/** CTA blanc sur fond brand (hero marketing) */
export const siteButtonOnDarkClass =
  'inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-normal text-[#8D5524] transition hover:bg-[#f8e9dc] md:text-lg'

export const siteButtonOnDarkOutlineClass =
  'inline-flex items-center justify-center rounded-xl border border-white/50 bg-transparent px-6 py-3 text-base font-normal text-white transition hover:border-white hover:bg-white/10 md:text-lg'

export const siteCtaOnDarkClass =
  'mt-3 inline-flex text-base font-semibold text-[#f8e9dc] underline-offset-4 hover:underline md:text-lg'

/** Lien texte sur fond clair : text-lg, souligné, coloré au survol */
export const siteTextLinkClass =
  'text-lg text-neutral-900 underline underline-offset-2 transition hover:text-[#8D5524]'

/** Lien texte dans une carte entièrement cliquable */
export const siteTextLinkInCardClass =
  'inline-flex text-lg text-neutral-900 underline underline-offset-2 transition group-hover:text-[#8D5524]'

/** Sections — alternance blanc / gris pierre (le crème est réservé au hero). */
export const siteSectionPaddingClass = 'py-14 sm:py-24'

export const siteSectionInnerClass = `mx-auto w-full ${siteMaxWidthClass} px-4 sm:px-6`

/** Bandeau hero de page (listes, filtres) */
export const sitePageHeroSectionClass = `w-full ${siteHeroDarkBgClass} py-8 sm:py-12`

/** @deprecated Préférer sitePageHeroSectionClass ou siteHeroDarkBgClass */
export const siteSectionBgCreamClass = siteHeroDarkBgClass
export const siteSectionBgWhiteClass = 'bg-white'
export const siteSectionBgMutedClass = 'bg-stone-100'

export const siteSectionWhiteClass = `w-full ${siteSectionBgWhiteClass} ${siteSectionPaddingClass}`
export const siteSectionMutedClass = `w-full ${siteSectionBgMutedClass} ${siteSectionPaddingClass}`

/** Grille 2 col. : média avant texte en mobile ; média à gauche dès lg */
export const siteSectionMediaFirstClass = 'order-1 lg:order-1'
export const siteSectionContentSecondClass = 'order-2 lg:order-2'

/** Grille 2 col. : média avant texte en mobile ; texte à gauche dès lg */
export const siteSectionContentFirstClass = 'order-2 lg:order-1'
export const siteSectionMediaSecondClass = 'order-1 lg:order-2'

export const siteGuideIntroSectionClass = `w-full ${siteHeroDarkBgClass} py-10 sm:py-14`

export const siteGuideListSectionClass = `w-full ${siteSectionBgWhiteClass} py-12 sm:py-16`

export const restaurantContentSectionClass = `scroll-mt-24 w-full border-t border-neutral-200/80 ${siteSectionPaddingClass}`
