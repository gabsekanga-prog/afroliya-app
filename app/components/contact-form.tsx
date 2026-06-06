'use client'

import { useState } from 'react'

import {
  formInputClassName,
  formLabelClassName,
  formTextareaClassName,
} from '@/app/components/form-fields'
import { siteButtonPrimaryClass, siteCardOnWhiteClass, siteHeading3Class } from '@/lib/site-styles'

export function ContactForm() {
  const [formKey, setFormKey] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    const subject = String(data.get('subject') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const email = String(data.get('email') ?? '').trim().toLowerCase()

    if (subject.length < 3 || message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('Veuillez remplir correctement tous les champs obligatoires.')
      setFeedbackType('error')
      return
    }

    setPending(true)
    setFeedback('')
    setFeedbackType(null)

    const response = await fetch('/api/contact-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message, email }),
    })

    setPending(false)

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      setFeedback(payload?.error ?? 'Une erreur est survenue. Merci de réessayer.')
      setFeedbackType('error')
      return
    }

    setFormKey((key) => key + 1)
    setFeedback('Merci, votre message a bien été envoyé. Nous vous répondrons dès que possible.')
    setFeedbackType('success')
  }

  return (
    <div className={siteCardOnWhiteClass}>
      <h2 className={siteHeading3Class}>Envoyer un message</h2>

      <form key={formKey} className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className={formLabelClassName}>
          Sujet du message
          <input
            type="text"
            name="subject"
            required
            minLength={3}
            maxLength={120}
            className={formInputClassName}
            autoComplete="off"
          />
        </label>

        <label className={formLabelClassName}>
          Votre message
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            className={formTextareaClassName}
          />
        </label>

        <label className={formLabelClassName}>
          Votre e-mail
          <input
            type="email"
            name="email"
            required
            className={formInputClassName}
            autoComplete="email"
          />
        </label>

        <button type="submit" disabled={pending} className={siteButtonPrimaryClass}>
          {pending ? 'Envoi…' : 'Envoyer'}
        </button>

        {feedback ? (
          <p
            className={
              feedbackType === 'success' ? 'text-sm text-green-800' : 'text-sm text-amber-800'
            }
            role="status"
          >
            {feedback}
          </p>
        ) : null}
      </form>
    </div>
  )
}
