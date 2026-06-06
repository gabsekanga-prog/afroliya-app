import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { privatePageMetadata } from '@/lib/site-metadata'

export const metadata: Metadata = {
  ...privatePageMetadata,
  title: 'Administration',
}

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
