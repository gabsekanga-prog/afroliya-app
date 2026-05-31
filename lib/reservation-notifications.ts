import { sendTransactionalEmail } from '@/lib/email/resend'
import {
  formatReservationDateFr,
  formatReservationTimeFr,
  reservationManageUrl,
  type ReservationRecord,
} from '@/lib/reservations'
import { sendSpryngSms } from '@/lib/sms/spryng'

type RestaurantContact = {
  name: string
  email: string | null
  whatsappPhone: string | null
}

function reservationSummaryLines(reservation: ReservationRecord, restaurantName: string) {
  const date = formatReservationDateFr(reservation.booking_date)
  const time = formatReservationTimeFr(reservation.booking_time)
  return {
    date,
    time,
    textBlock: [
      `Restaurant : ${restaurantName}`,
      `Client : ${reservation.client_name}`,
      `E-mail : ${reservation.client_email}`,
      reservation.client_phone ? `Téléphone : ${reservation.client_phone}` : null,
      `Date : ${date}`,
      `Heure : ${time}`,
      `Personnes : ${reservation.group_size}`,
      reservation.remarks ? `Remarques : ${reservation.remarks}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
  }
}

export async function notifyNewReservation(
  reservation: ReservationRecord,
  restaurant: RestaurantContact,
): Promise<void> {
  const manageUrl = reservationManageUrl(reservation.public_code)
  const { textBlock, date, time } = reservationSummaryLines(reservation, restaurant.name)

  const tasks: Promise<void>[] = []

  const restaurantEmail = restaurant.email?.trim()
  if (restaurantEmail) {
    tasks.push(
      sendTransactionalEmail({
        to: restaurantEmail,
        subject: `[Afroliya] Nouvelle demande de réservation`,
        text: `${textBlock}\n\nGérer la demande : ${manageUrl}`,
        html: `
        <p>Nouvelle demande de réservation reçue via Afroliya.</p>
        <pre style="font-family:sans-serif;white-space:pre-wrap">${textBlock}</pre>
        <p><a href="${manageUrl}">Accepter ou refuser la demande</a></p>
      `,
      }),
    )
  }

  tasks.push(
    sendTransactionalEmail({
      to: reservation.client_email,
      subject: `Votre demande de réservation — ${restaurant.name}`,
      text: `Bonjour ${reservation.client_name},\n\nVotre demande de réservation a bien été transmise au restaurant ${restaurant.name}.\n\n${textBlock}\n\nLe restaurant vous confirmera sa disponibilité prochainement.\n\n— Afroliya`,
      html: `
      <p>Bonjour ${reservation.client_name},</p>
      <p>Votre demande de réservation a bien été transmise au restaurant <strong>${restaurant.name}</strong>.</p>
      <pre style="font-family:sans-serif;white-space:pre-wrap">${textBlock}</pre>
      <p>Le restaurant vous confirmera sa disponibilité prochainement.</p>
      <p>— Afroliya</p>
    `,
    }),
  )

  const smsPhone = restaurant.whatsappPhone?.trim()
  if (smsPhone) {
    const smsBody = `Afroliya : Nouvelle reservation - ${reservation.client_name}, ${reservation.group_size} pers., le ${date}, ${time}. Acceptez ou annulez ici : ${manageUrl}`
    tasks.push(
      sendSpryngSms({
        recipients: [smsPhone],
        body: smsBody,
        reference: reservation.public_code,
      }),
    )
  }

  const results = await Promise.allSettled(tasks)
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[reservations] notification failed', result.reason)
    }
  }
}

export async function notifyReservationStatusChange(
  reservation: ReservationRecord,
  restaurant: RestaurantContact,
  status: 'confirmed' | 'declined',
): Promise<void> {
  const { textBlock } = reservationSummaryLines(reservation, restaurant.name)
  const isConfirmed = status === 'confirmed'

  await sendTransactionalEmail({
    to: reservation.client_email,
    subject: isConfirmed
      ? `Réservation confirmée — ${restaurant.name}`
      : `Réservation refusée — ${restaurant.name}`,
    text: isConfirmed
      ? `Bonjour ${reservation.client_name},\n\nBonne nouvelle ! ${restaurant.name} a confirmé votre réservation.\n\n${textBlock}\n\n— Afroliya`
      : `Bonjour ${reservation.client_name},\n\n${restaurant.name} n'a malheureusement pas pu accepter votre demande de réservation.\n\n${textBlock}\n\n— Afroliya`,
    html: isConfirmed
      ? `<p>Bonjour ${reservation.client_name},</p><p>Bonne nouvelle ! <strong>${restaurant.name}</strong> a confirmé votre réservation.</p><pre style="font-family:sans-serif;white-space:pre-wrap">${textBlock}</pre><p>— Afroliya</p>`
      : `<p>Bonjour ${reservation.client_name},</p><p><strong>${restaurant.name}</strong> n'a malheureusement pas pu accepter votre demande.</p><pre style="font-family:sans-serif;white-space:pre-wrap">${textBlock}</pre><p>— Afroliya</p>`,
  })
}

export async function sendEmailVerificationCode(email: string, code: string): Promise<void> {
  await sendTransactionalEmail({
    to: email,
    subject: 'Votre code de vérification Afroliya',
    text: `Votre code de vérification Afroliya : ${code}\n\nIl expire dans 15 minutes.`,
    html: `<p>Votre code de vérification Afroliya :</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p><p>Il expire dans 15 minutes.</p>`,
  })
}
