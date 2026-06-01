import { HomePageClient } from './components/home-page-client'
import { fetchLatestPublishedGuides } from '@/lib/guides'

export const revalidate = 120

export default async function HomePage() {
  const latestGuides = await fetchLatestPublishedGuides(3)

  return <HomePageClient latestGuides={latestGuides} />
}
