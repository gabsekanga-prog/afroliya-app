import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { ExperiencesListClient } from '@/app/components/experiences-list-client'
import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import { buildExperienceFilterOptions, getPublishedEvents } from '@/lib/experiences'

export default function EvenementsPage() {
  const events = getPublishedEvents()
  const filterOptions = buildExperienceFilterOptions(events)

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader />

      <ExperiencesListClient
        experiences={events}
        filterOptions={filterOptions}
        pageTitle="Événements afro en Belgique"
        pageLead="+20 événements — Sélection de qualité — Achat de tickets possible"
        emptyMessage="Aucun événement publié pour le moment. Revenez bientôt."
        listHeading="Événements à venir"
        searchPlaceholder="Rechercher par nom, type, lieu…"
        breadcrumbLabel="Événements"
        resultLabel="événement"
      />

      <CommunitySignupSection tone="muted" />

      <SiteFooter />
    </main>
  )
}
