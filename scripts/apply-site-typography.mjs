import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function patch(file, transforms) {
  const full = path.join(root, file)
  if (!fs.existsSync(full)) return
  let c = fs.readFileSync(full, 'utf8')
  const o = c
  for (const [from, to] of transforms) {
    c = typeof from === 'string' ? c.split(from).join(to) : c.replace(from, to)
  }
  if (c !== o) {
    fs.writeFileSync(full, c)
    console.log('patched', file)
  }
}

// Home page: remove duplicate header
{
  const file = 'app/components/home-page-client.tsx'
  const full = path.join(root, file)
  let c = fs.readFileSync(full, 'utf8')
  c = c.replace(/<header className="relative z-50[\s\S]*?<\/header>\s*/, '<SiteHeader active="concept" />\n\n      ')
  const reps = [
    ['<section className="w-full bg-[#2a1810] pb-0 sm:pb-0">', '<section className={siteHeroSectionClass}>'],
    ['className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6"', 'className={siteHeroInnerClass}'],
    ['<h1 className="text-4xl font-bold leading-tight lg:text-5xl max-w-5xl">', '<h1 className={`${siteHeading1Class} max-w-5xl`}>'],
    ['<p className="mt-4 text-lg text-[#f8e9dc]">', '<p className={siteHeroLeadOnDarkClass}>'],
    [
      'className="inline-flex h-12 min-w-[230px] items-center justify-center rounded-xl bg-[#8D5524] px-6 text-lg font-normal text-white transition hover:bg-[#74431a]"',
      'className={`${siteButtonPrimaryClass} h-12 min-w-[230px]`}',
    ],
    ['<section className="w-full bg-[#f8f1ea] py-14 sm:py-24">', '<section className={`w-full bg-[#f8f1ea] ${siteSectionPaddingClass}`}>'],
    ['<section className="w-full bg-white py-14 sm:py-24">', '<section className={`w-full bg-white ${siteSectionPaddingClass}`}>'],
    ['<section className="w-full bg-stone-100 py-14 sm:py-24">', '<section className={`w-full bg-stone-100 ${siteSectionPaddingClass}`}>'],
    ['className="text-3xl font-bold leading-tight text-neutral-900 lg:text-4xl"', 'className={siteHeading2LeadingClass}'],
    ['className="text-3xl font-bold text-neutral-900 lg:text-4xl"', 'className={siteHeading2Class}'],
    ['className="mt-2 text-3xl font-bold leading-tight text-neutral-900 lg:text-4xl"', 'className={`mt-2 ${siteHeading2LeadingClass}`}'],
    ['className="mt-7 space-y-3 text-base text-neutral-600 md:text-lg"', 'className={`mt-7 space-y-3 ${siteBodyClass}`}'],
    ['className="mt-7 text-base font-bold text-neutral-600 md:text-lg"', 'className={`mt-7 ${siteBodyBoldClass}`}'],
    ['className="mt-4 text-xl font-bold text-neutral-900 lg:text-2xl"', 'className={`mt-4 ${siteHeading3Class}`}'],
    ['className="mt-3 text-lg leading-relaxed text-neutral-600"', 'className={`mt-3 ${siteBodyRelaxedClass}`}'],
    [
      'className="mt-6 inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"',
      'className={`mt-6 ${siteButtonPrimarySmClass}`}',
    ],
    [
      'className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"',
      'className={`mt-8 ${siteButtonPrimaryClass}`}',
    ],
    ['className="text-lg font-bold leading-snug text-white lg:text-xl"', 'className={siteHeading3OnDarkClass}'],
    ['className="mt-3 inline-flex text-base font-semibold text-[#f8e9dc]', 'className={siteCtaOnDarkClass}'],
    ['className="mt-4 text-base text-neutral-600 md:text-lg"', 'className={`mt-4 ${siteBodyClass}`}'],
    ['className="mt-8 text-base text-neutral-600 md:text-lg"', 'className={`mt-8 ${siteBodyClass}`}'],
    [
      'className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"',
      'className={siteButtonPrimaryClass}',
    ],
  ]
  for (const [a, b] of reps) c = c.split(a).join(b)
  fs.writeFileSync(full, c)
  console.log('patched', file)
}

patch('app/devenir-partenaire/page.tsx', [
  [/<header className="relative z-50[\s\S]*?<\/header>\s*/, '<SiteHeader active="partenaire" />\n\n      '],
])
// run devenir with fs read like home
for (const file of [
  'app/devenir-partenaire/page.tsx',
  'app/restaurants/page.tsx',
  'app/guides/layout.tsx',
]) {
  const full = path.join(root, file)
  let c = fs.readFileSync(full, 'utf8')
  if (!c.includes('SiteHeader')) {
    c = c.replace(/<header className="relative z-50[\s\S]*?<\/header>\s*/, () => {
      const active = file.includes('partenaire')
        ? 'partenaire'
        : file.includes('restaurants/page')
          ? 'restaurants'
          : 'concept'
      return `<SiteHeader active="${active}" />\n\n      `
    })
  }
  const reps = [
    ['<section className="w-full bg-[#2a1810] pb-0 sm:pb-0">', '<section className={siteHeroSectionClass}>'],
    ['<section className="w-full bg-[#2a1810] pb-0">', '<section className={siteHeroSectionClass}>'],
    ['className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6"', 'className={siteHeroInnerClass}'],
    ['<h1 className="text-4xl font-bold leading-tight lg:text-5xl max-w-5xl">', '<h1 className={`${siteHeading1Class} max-w-5xl`}>'],
    ['<p className="mt-4 text-lg text-[#f8e9dc]">', '<p className={siteHeroLeadOnDarkClass}>'],
    [
      'className="mt-8 inline-flex h-12 min-w-[230px] items-center justify-center rounded-xl bg-[#8D5524] px-6 text-lg font-normal text-white transition hover:bg-[#74431a]"',
      'className={`mt-8 ${siteButtonPrimaryClass} h-12 min-w-[230px]`}',
    ],
    ['<section className="w-full bg-[#f8f1ea] py-14 sm:py-24">', '<section className={`w-full bg-[#f8f1ea] ${siteSectionPaddingClass}`}>'],
    ['<section className="w-full bg-white py-14 sm:py-24">', '<section className={`w-full bg-white ${siteSectionPaddingClass}`}>'],
    ['<section className="w-full bg-stone-100 py-14 sm:py-24">', '<section className={`w-full bg-stone-100 ${siteSectionPaddingClass}`}>'],
    ['className="w-full scroll-mt-24 bg-white py-14 sm:py-24"', 'className={`w-full scroll-mt-24 bg-white ${siteSectionPaddingClass}`}'],
    ['className="text-3xl font-bold text-neutral-900 lg:text-4xl"', 'className={siteHeading2Class}'],
    ['className="text-3xl font-bold leading-tight text-neutral-900 lg:text-4xl"', 'className={siteHeading2LeadingClass}'],
    ['className="text-3xl font-bold leading-tight text-neutral-900 lg:text-4xl"', 'className={siteHeading1PageClass}'],
    ['className="mt-4 text-xl font-bold text-neutral-900 lg:text-2xl"', 'className={`mt-4 ${siteHeading3Class}`}'],
    ['className="text-xl font-bold text-neutral-900 lg:text-2xl"', 'className={siteHeading3Class}'],
    ['className="mt-3 text-lg leading-relaxed text-neutral-600"', 'className={`mt-3 ${siteBodyRelaxedClass}`}'],
    ['className="mt-6 space-y-2 pl-6 text-base text-neutral-600 md:text-lg"', 'className={`mt-6 space-y-2 pl-6 ${siteBodyClass}`}'],
    ['className="mt-6 text-base font-semibold text-neutral-600 md:text-lg"', 'className={`mt-6 ${siteBodySemiboldClass}`}'],
    ['className="mt-2 text-base text-neutral-600 md:text-lg"', 'className={`mt-2 ${siteBodyClass}`}'],
    ['className="mt-3 text-base text-neutral-600 md:text-lg"', 'className={`mt-3 ${siteBodyClass}`}'],
    ['mt-4 space-y-2 text-base text-neutral-600"', 'mt-4 space-y-2 ${siteBodyClass}"'],
    [
      'className="mt-8 inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"',
      'className={`mt-8 ${siteButtonPrimaryClass}`}',
    ],
    [
      'className="mt-6 inline-flex rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]"',
      'className={`mt-6 ${siteButtonPrimarySmClass}`}',
    ],
  ]
  for (const [a, b] of reps) c = c.split(a).join(b)
  // add imports if SiteHeader added
  if (c.includes('SiteHeader') && !c.includes("from '@/app/components/site-header'")) {
    const importLine = file.includes('devenir-partenaire')
      ? `import { SiteHeader } from '@/app/components/site-header'\nimport {\n  siteBodyClass,\n  siteBodyRelaxedClass,\n  siteBodySemiboldClass,\n  siteButtonPrimaryClass,\n  siteButtonPrimarySmClass,\n  siteHeading1Class,\n  siteHeading2Class,\n  siteHeading2LeadingClass,\n  siteHeading3Class,\n  siteHeroInnerClass,\n  siteHeroLeadOnDarkClass,\n  siteHeroSectionClass,\n  siteSectionPaddingClass,\n} from '@/lib/site-styles'\n`
      : file.includes('restaurants/page')
        ? `import { SiteHeader } from '@/app/components/site-header'\nimport { siteBodyClass, siteHeading1PageClass, siteSectionPaddingClass } from '@/lib/site-styles'\n`
        : `import { SiteHeader } from '@/app/components/site-header'\n`
    c = c.replace(/^import Link from 'next\/link'\n/m, (m) => m + importLine)
  }
  fs.writeFileSync(full, c)
  console.log('patched', file)
}

// guides pages
for (const file of ['app/guides/page.tsx', 'app/guides/[slug]/page.tsx']) {
  const full = path.join(root, file)
  let c = fs.readFileSync(full, 'utf8')
  const reps = [
    ['<section className="w-full bg-[#f8f1ea] py-10 sm:py-14">', '<section className={siteGuideIntroSectionClass}>'],
    ['<section className="w-full bg-white py-12 sm:py-16">', '<section className={siteGuideListSectionClass}>'],
    ['className="mt-6 text-3xl font-bold text-neutral-900 lg:text-4xl"', 'className={`mt-6 ${siteHeading1PageClass}`}'],
    ['className="mt-4 text-4xl font-bold leading-tight lg:text-5xl"', 'className={`mt-4 ${siteHeading1OnDarkClass}`}'],
    ['className="flex flex-wrap items-center gap-x-2 text-lg text-[#f8e9dc]"', 'className={siteHeroBreadcrumbOnDarkClass}'],
    ['className="text-lg font-bold leading-snug text-white lg:text-xl"', 'className={siteHeading3OnDarkClass}'],
    ['<section className="w-full bg-[#2a1810] pb-0">', '<section className={siteHeroSectionClass}>'],
  ]
  for (const [a, b] of reps) c = c.split(a).join(b)
  if (!c.includes('site-styles')) {
    c = `import {\n  siteGuideIntroSectionClass,\n  siteGuideListSectionClass,\n  siteHeading1PageClass,\n  siteHeading1OnDarkClass,\n  siteHeading3OnDarkClass,\n  siteHeroBreadcrumbOnDarkClass,\n  siteHeroSectionClass,\n  siteBodyClass,\n  siteButtonPrimaryClass,\n} from '@/lib/site-styles'\n` + c
  }
  fs.writeFileSync(full, c)
  console.log('patched', file)
}

// Restaurant detail page
{
  const file = 'app/restaurants/[slug]/page.tsx'
  const full = path.join(root, file)
  let c = fs.readFileSync(full, 'utf8')
  if (!c.includes('SiteHeader')) {
    c = c.replace(/<header className="relative z-50[\s\S]*?<\/header>\s*/, '<SiteHeader active="restaurants" />\n\n      ')
    c = c.replace(
      "} from '@/lib/site-styles'",
      ", siteBodyClass, siteButtonPrimaryClass, siteHeroMetaOnDarkClass,\n} from '@/lib/site-styles'",
    )
    c = c.replace(
      "} from '@/lib/site-styles'",
      "}\nimport { SiteHeader } from '@/app/components/site-header'",
    )
  }
  const reps = [
    [
      'className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-lg text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)]"',
      'className={`mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 ${siteHeroMetaOnDarkClass}`}',
    ],
    ['className="mt-2 text-base text-neutral-600 md:text-lg"', 'className={`mt-2 ${siteBodyClass}`}'],
    ['className="mt-6 text-base text-neutral-600 md:text-lg"', 'className={`mt-6 ${siteBodyClass}`}'],
    [
      'className="mt-2 flex items-start gap-2 text-base text-neutral-600 md:text-lg"',
      'className={`mt-2 flex items-start gap-2 ${siteBodyClass}`}',
    ],
    ['className="mt-4 text-base text-neutral-600 md:text-lg"', 'className={`mt-4 ${siteBodyClass}`}'],
    [
      'className="inline-flex h-12 items-center justify-center rounded-xl bg-[#8D5524] px-6 text-lg font-normal text-white shadow-lg transition hover:bg-[#74431a]"',
      'className={`${siteButtonPrimaryClass} h-12 shadow-lg`}',
    ],
    [
      'className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a]"',
      'className={siteButtonPrimaryClass}',
    ],
  ]
  for (const [a, b] of reps) c = c.split(a).join(b)
  fs.writeFileSync(full, c)
  console.log('patched', file)
}

// Shared components
for (const [file, reps] of [
  [
    'app/components/guide-structured-content.tsx',
    [
      [
        "className='mt-6 inline-flex w-fit rounded-xl bg-[#8D5524] px-5 py-2.5 text-lg font-normal text-white transition hover:bg-[#74431a]'",
        "className={`mt-6 inline-flex w-fit ${siteButtonPrimarySmClass}`}",
      ],
      ['className="text-xl font-bold text-neutral-900 lg:text-2xl"', 'className={siteHeading2Class}'],
      [
        'className="mt-6 text-base leading-relaxed text-neutral-700 md:text-lg sm:mt-8"',
        'className={`mt-6 ${siteBodyOnDarkClass} sm:mt-8`}',
      ],
      [
        'className="mt-5 text-base leading-relaxed text-neutral-600 md:text-lg sm:mt-6"',
        'className={`mt-5 ${siteBodyRelaxedClass} sm:mt-6`}',
      ],
    ],
  ],
  [
    'app/components/community-signup-section.tsx',
    [
      [
        'className="mt-5 space-y-2 text-base leading-relaxed text-neutral-600 md:text-lg sm:mt-6"',
        'className={`mt-5 space-y-2 ${siteBodyRelaxedClass} sm:mt-6`}',
      ],
      [
        'className="inline-flex rounded-xl bg-[#8D5524] px-6 py-3 text-lg font-normal text-white transition hover:bg-[#74431a] disabled:opacity-70"',
        'className={`inline-flex ${siteButtonPrimaryClass} disabled:opacity-70`}',
      ],
    ],
  ],
  [
    'app/components/restaurant-card.tsx',
    [['className="text-lg font-bold text-neutral-900"', 'className={siteHeading3Class}']],
  ],
  [
    'app/components/restaurants-list-client.tsx',
    [['className="text-xl font-bold text-neutral-900 lg:text-2xl"', 'className={siteHeading2Class}']],
  ],
  [
    'app/components/guides-carousel.tsx',
    [['className="text-lg font-bold leading-snug text-white lg:text-xl"', 'className={siteHeading3OnDarkClass}']],
  ],
]) {
  const full = path.join(root, file)
  let c = fs.readFileSync(full, 'utf8')
  if (!c.includes('site-styles') && file !== 'app/components/restaurant-card.tsx') {
    const imp = `import { siteBodyRelaxedClass, siteBodyOnDarkClass, siteButtonPrimarySmClass, siteHeading2Class } from '@/lib/site-styles'\n`
    c = imp + c
  }
  if (file === 'app/components/community-signup-section.tsx' && !c.includes('siteButtonPrimaryClass')) {
    c = c.replace(
      "import { siteHeading2Class } from '@/lib/site-styles'",
      "import { siteBodyRelaxedClass, siteButtonPrimaryClass, siteHeading2Class, siteSectionPaddingClass } from '@/lib/site-styles'",
    )
  }
  if (file === 'app/components/guide-structured-content.tsx' && !c.includes('siteButtonPrimarySmClass')) {
    c = `import {\n  siteBodyOnDarkClass,\n  siteBodyRelaxedClass,\n  siteButtonPrimarySmClass,\n  siteHeading2Class,\n  siteBodyClass,\n} from '@/lib/site-styles'\n` + c
  }
  if (file === 'app/components/restaurant-card.tsx') {
    c = `import { siteHeading3Class } from '@/lib/site-styles'\n` + c.replace(/^import/, 'import')
  }
  if (file === 'app/components/restaurants-list-client.tsx') {
    c = c.replace(
      /^import/,
      "import { siteHeading2Class, siteBodyClass } from '@/lib/site-styles'\nimport",
    )
  }
  if (file === 'app/components/guides-carousel.tsx') {
    c = c.replace(
      /^import/,
      "import { siteHeading3OnDarkClass } from '@/lib/site-styles'\nimport",
    )
  }
  for (const [a, b] of reps) c = c.split(a).join(b)
  fs.writeFileSync(full, c)
  console.log('patched', file)
}

console.log('done')
