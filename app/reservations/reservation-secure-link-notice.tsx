import { ShieldCheck } from 'lucide-react'

import { siteBodyClass } from '@/lib/site-styles'

type Props = {
  expired: boolean
}

export function ReservationSecureLinkNotice({ expired }: Props) {
  if (expired) return null

  return (
    <p
      className={`mt-4 flex items-start gap-2.5 rounded-xl border border-neutral-200/80 bg-white/80 px-4 py-3 ${siteBodyClass}`}
    >
      <ShieldCheck
        className="mt-0.5 h-5 w-5 shrink-0 text-[#8D5524]"
        strokeWidth={2}
        aria-hidden
      />
      <span>
        Il s’agit d’un lien temporaire et sécurisé, personnel à cette réservation.
      </span>
    </p>
  )
}
