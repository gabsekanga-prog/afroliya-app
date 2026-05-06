import { fetchPublishedGuides } from '@/lib/guides'

import { HomePageClient } from './components/home-page-client'

export default async function HomePage() {
  const guides = (await fetchPublishedGuides()).slice(0, 3)

  return <HomePageClient guides={guides} />
}
