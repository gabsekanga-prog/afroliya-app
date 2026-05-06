'use client'

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-lg text-neutral-800 transition hover:bg-stone-50"
      onClick={async () => {
        await fetch('/api/admin/logout', { method: 'POST' })
        window.location.href = '/admin/login'
      }}
    >
      Déconnexion
    </button>
  )
}
