import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { ExperiencesListClient } from '@/app/components/experiences-list-client'
import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import { buildExperienceFilterOptions, getPublishedActivities } from '@/lib/experiences'

export default function ActivitesPage() {
  const activities = getPublishedActivities()
  const filterOptions = buildExperienceFilterOptions(activities)

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader />

      <ExperiencesListClient
        experiences={activities}
        filterOptions={filterOptions}
        pageTitle="Activités afro en Belgique"
        pageLead="+10 activités — Sélection de qualité — Réservation en ligne possible"
        emptyMessage="Aucune activité publiée pour le moment. Revenez bientôt."
        listHeading="Activités recommandées"
        searchPlaceholder="Rechercher par nom, type, lieu…"
        breadcrumbLabel="Activités"
        resultLabel="activité"
      />
      <CommunitySignupSection tone="muted" />

      <SiteFooter />
    </main>
  )
}
