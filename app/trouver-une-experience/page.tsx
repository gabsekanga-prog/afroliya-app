import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { ExperienceCategoriesGrid } from '@/app/components/experience-categories-section'
import { ExperienceCategorySection } from '@/app/components/experience-category-section'
import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'
import {
  EXPERIENCE_HUB_PREVIEW_COUNT,
  getPublishedActivities,
  getPublishedEvents,
  restaurantToExperience,
} from '@/lib/experiences'
import { fetchPublishedRestaurants } from '@/lib/restaurants'
import {
  siteHeading1OnDarkClass,
  siteHeroBgClass,
  siteSectionBgMutedClass,
  siteSectionBgWhiteClass,
  siteSectionInnerClass,
  siteSubtitleLeadOnDarkClass,
} from '@/lib/site-styles'

export const dynamic = 'force-dynamic'

export default async function TrouverUneExperiencePage() {
  const restaurants = (await fetchPublishedRestaurants())
    .slice(0, EXPERIENCE_HUB_PREVIEW_COUNT)
    .map(restaurantToExperience)

  const events = getPublishedEvents().slice(0, EXPERIENCE_HUB_PREVIEW_COUNT)
  const activities = getPublishedActivities().slice(
    0,
    EXPERIENCE_HUB_PREVIEW_COUNT,
  )

  return (
    <main className="min-h-screen text-neutral-900">
      <SiteHeader active="experiences" />

      <section className={`w-full ${siteHeroBgClass} py-10 sm:py-14 lg:py-16`}>
        <div className={siteSectionInnerClass}>
          <h1 className={siteHeading1OnDarkClass}>
            Des expériences afro à faire en Belgique
          </h1>
          <p className={siteSubtitleLeadOnDarkClass}>
            Choisissez la catégorie qui vous intéresse.
          </p>
          <ExperienceCategoriesGrid className="mt-10 sm:mt-12" />
        </div>
      </section>

      <section className={`w-full ${siteSectionBgMutedClass} py-12 sm:py-16`}>
        <div className={siteSectionInnerClass}>
          <ExperienceCategorySection
            category="restaurants"
            title="Restaurants"
            items={restaurants}
          />
        </div>
      </section>

      <section className={`w-full ${siteSectionBgWhiteClass} py-12 sm:py-16`}>
        <div className={siteSectionInnerClass}>
          <ExperienceCategorySection
            category="evenements"
            title="Événements"
            items={events}
          />
        </div>
      </section>

      <section className={`w-full ${siteSectionBgMutedClass} py-12 sm:py-16`}>
        <div className={siteSectionInnerClass}>
          <ExperienceCategorySection
            category="activites"
            title="Activités"
            items={activities}
          />
        </div>
      </section>

      <CommunitySignupSection tone="white" />

      <SiteFooter />
    </main>
  )
}
