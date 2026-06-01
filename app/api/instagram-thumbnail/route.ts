import { NextResponse } from 'next/server'

import { normalizeInstagramPostUrl } from '@/lib/instagram-embed'
import { fetchInstagramThumbnailFromOEmbed } from '@/lib/instagram-thumbnail'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postUrl = searchParams.get('url') ?? ''
  const permalink = normalizeInstagramPostUrl(postUrl)

  if (!permalink) {
    return NextResponse.json({ thumbnailUrl: null }, { status: 400 })
  }

  const thumbnailUrl = await fetchInstagramThumbnailFromOEmbed(postUrl)

  return NextResponse.json(
    { thumbnailUrl },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
