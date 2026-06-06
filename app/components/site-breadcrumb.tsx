import Link from 'next/link'
import { Fragment } from 'react'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
  tone?: 'default' | 'onDark'
  className?: string
}

function breadcrumbStyles(tone: 'default' | 'onDark') {
  void tone

  return {
    nav: 'flex flex-wrap items-center gap-x-2 text-base',
    link: 'font-normal text-neutral-500 underline underline-offset-2 transition hover:text-neutral-700',
    current: 'font-normal text-neutral-900',
    separator: 'text-neutral-400',
  }
}

export function SiteBreadcrumb({ items, tone = 'default', className = '' }: Props) {
  const styles = breadcrumbStyles(tone)

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={`${styles.nav}${className ? ` ${className}` : ''}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const isCurrent = isLast || !item.href

        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 ? (
              <span aria-hidden className={styles.separator}>
                &gt;
              </span>
            ) : null}
            {isCurrent ? (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href!} className={styles.link}>
                {item.label}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
