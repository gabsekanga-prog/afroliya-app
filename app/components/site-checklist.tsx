import { siteBodyRelaxedClass } from '@/lib/site-styles'

type Props = {
  items: string[]
  className?: string
  tone?: 'default' | 'onDark'
}

export function SiteChecklist({ items, className, tone = 'default' }: Props) {
  const bodyClass =
    tone === 'onDark'
      ? 'text-base leading-relaxed text-[#f8e9dc]/95 md:text-lg'
      : siteBodyRelaxedClass
  const checkClass =
    tone === 'onDark' ? 'text-[#f8e9dc] shrink-0 font-semibold' : 'text-brand shrink-0 font-semibold'

  return (
    <ul
      className={`mt-4 space-y-2 ${bodyClass} sm:mt-5 ${className ?? ''}`}
    >
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className={checkClass} aria-hidden>
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
