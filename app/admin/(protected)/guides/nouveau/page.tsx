import Link from 'next/link'

import { GuideForm } from '../guide-form'

export default function AdminNewGuidePage() {
  return (
    <div>
      <Link href="/admin/guides" className="text-lg text-brand hover:underline">
        ← Liste des guides
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-neutral-900">Nouveau guide</h1>
      <div className="mt-8">
        <GuideForm guide={null} />
      </div>
    </div>
  )
}
