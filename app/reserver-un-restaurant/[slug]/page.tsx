import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function LegacyReserverUnRestaurantSlugPage({ params }: Props) {
  const { slug } = await params
  redirect(`/restaurants/${slug}`)
}
