import type { ReactNode } from 'react'

import { CommunitySignupSection } from '@/app/components/community-signup-section'
import { SiteFooter } from '@/app/components/site-footer'
import { SiteHeader } from '@/app/components/site-header'

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col text-neutral-900">
      <SiteHeader />

      <main className="flex-1">{children}</main>

      <CommunitySignupSection />

      <SiteFooter />
    </div>
  )
}
