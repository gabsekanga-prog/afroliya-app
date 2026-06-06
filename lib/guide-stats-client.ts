'use client'

type TrackGuidePageViewInput = {
  guideId: string
  pagePath?: string
}

export async function trackGuidePageView({
  guideId,
  pagePath,
}: TrackGuidePageViewInput) {
  const payload = JSON.stringify({
    guide_id: guideId,
    page_path: pagePath ?? window.location.pathname,
  })

  try {
    await fetch('/api/guide-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    })
  } catch {
    // Le tracking ne doit jamais casser l'UX.
  }
}
