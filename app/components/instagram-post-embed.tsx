'use client'

import { useEffect } from 'react'

import { normalizeInstagramPostUrl } from '@/lib/instagram-embed'

type Props = {
  postUrl: string
}

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void
      }
    }
  }
}

function loadInstagramEmbedScript() {
  if (document.getElementById('instagram-embed-script')) {
    window.instgrm?.Embeds?.process()
    return
  }

  const script = document.createElement('script')
  script.id = 'instagram-embed-script'
  script.src = 'https://www.instagram.com/embed.js'
  script.async = true
  document.body.appendChild(script)
}

export function InstagramPostEmbed({ postUrl }: Props) {
  const permalink = normalizeInstagramPostUrl(postUrl)

  useEffect(() => {
    if (!permalink) return
    loadInstagramEmbedScript()
  }, [permalink])

  if (!permalink) return null

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-2 shadow-sm sm:p-3">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: 3,
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: 540,
          minWidth: 326,
          padding: 0,
          width: 'calc(100% - 2px)',
        }}
      />
    </div>
  )
}
