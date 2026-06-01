import { SiteBreadcrumb } from '@/app/components/site-breadcrumb'

type BreadcrumbSegment = {
  label: string
  href: string
}

type Props = {
  /** Libellé de la page courante (ex. Restaurants, nom du resto). */
  currentLabel: string
  /** Segment intermédiaire (ex. Restaurants sur une fiche détail). */
  parent?: BreadcrumbSegment
  /** Fond sombre du hero marketing. */
  tone?: 'default' | 'onDark'
}

export function ExperienceBreadcrumb({
  currentLabel,
  parent,
  tone = 'default',
}: Props) {
  const items = [
    { label: 'Accueil', href: '/' },
    ...(parent ? [{ label: parent.label, href: parent.href }] : []),
    { label: currentLabel },
  ]

  return (
    <SiteBreadcrumb items={items} tone={tone} className="mb-3" />
  )
}
