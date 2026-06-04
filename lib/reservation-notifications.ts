import { buildReservationEmailTemplateData } from '@/lib/email/reservation-email-data'
import {
  getAdminNotificationEmails,
  sendSimpleTemplateEmail,
  sendTemplateEmail,
} from '@/lib/email/sendgrid'
import { SENDGRID_TEMPLATE_IDS } from '@/lib/email/sendgrid-templates'
import {
  reservationClientUrl,
  reservationManageUrl,
  type ReservationRecord,
} from '@/lib/reservations'
import { sendSpryngSms } from '@/lib/sms/spryng'

type RestaurantContact = {
  name: string
  email: string | null
  whatsappPhone: string | null
}

export async function notifyNewReservation(
  reservation: ReservationRecord,
  restaurant: RestaurantContact,
): Promise<void> {
  const manageUrl = reservationManageUrl(reservation.public_code)
  const clientUrl = reservationClientUrl(reservation.public_code)
  const templateData = await buildReservationEmailTemplateData(reservation, restaurant.name, {
    managementUrl: clientUrl,
  })

  const restaurantMailData = {
    ...templateData,
    managementUrl: manageUrl,
  }

  const tasks: Promise<void>[] = []

  const restaurantEmail = restaurant.email?.trim()
  if (restaurantEmail) {
    tasks.push(
      sendTemplateEmail({
        to: restaurantEmail,
        templateId: SENDGRID_TEMPLATE_IDS.reservationNewRestaurant,
        dynamicTemplateData: restaurantMailData,
      }),
    )
  }

  const adminEmails = getAdminNotificationEmails().filter(
    (email) => email.toLowerCase() !== restaurantEmail?.toLowerCase(),
  )
  if (adminEmails.length > 0) {
    tasks.push(
      sendTemplateEmail({
        to: adminEmails,
        templateId: SENDGRID_TEMPLATE_IDS.reservationNewRestaurant,
        dynamicTemplateData: restaurantMailData,
      }),
    )
  }

  tasks.push(
    sendTemplateEmail({
      to: reservation.client_email,
      templateId: SENDGRID_TEMPLATE_IDS.reservationRequestClient,
      dynamicTemplateData: templateData,
    }),
  )

  const smsPhone = restaurant.whatsappPhone?.trim()
  if (smsPhone) {
    const smsBody = `Afroliya : Nouvelle reservation - ${reservation.client_name}, ${reservation.group_size} pers., le ${templateData.date}, ${templateData.hour}. Acceptez ou annulez ici : ${manageUrl}`
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
  const clientUrl = reservationClientUrl(reservation.public_code)
  const templateData = await buildReservationEmailTemplateData(reservation, restaurant.name, {
    managementUrl: clientUrl,
  })

  if (status === 'confirmed') {
    await sendTemplateEmail({
      to: reservation.client_email,
      templateId: SENDGRID_TEMPLATE_IDS.reservationConfirmedClient,
      dynamicTemplateData: templateData,
    })
    return
  }

  await sendTemplateEmail({
    to: reservation.client_email,
    templateId: SENDGRID_TEMPLATE_IDS.reservationCancelledByRestaurantClient,
    dynamicTemplateData: templateData,
  })
}

/** Annulation initiée par le client — notification au restaurant (templates 4 & 6). */
export async function notifyRestaurantReservationCancelledByClient(
  reservation: ReservationRecord,
  restaurant: RestaurantContact,
  clientMessage?: string | null,
): Promise<void> {
  const restaurantEmail = restaurant.email?.trim()
  if (!restaurantEmail) return

  const manageUrl = reservationManageUrl(reservation.public_code)
  const templateData = await buildReservationEmailTemplateData(reservation, restaurant.name, {
    managementUrl: manageUrl,
    clientMessage,
    includeClientMessage: clientMessage === undefined,
  })

  await sendTemplateEmail({
    to: restaurantEmail,
    templateId: SENDGRID_TEMPLATE_IDS.reservationCancelledRestaurant,
    dynamicTemplateData: templateData,
  })
}

/** Annulation initiée par le restaurant — notification au client (template 5). */
export async function notifyClientReservationCancelledByRestaurant(
  reservation: ReservationRecord,
  restaurant: RestaurantContact,
): Promise<void> {
  const templateData = await buildReservationEmailTemplateData(reservation, restaurant.name)

  await sendTemplateEmail({
    to: reservation.client_email,
    templateId: SENDGRID_TEMPLATE_IDS.reservationCancelledByRestaurantClient,
    dynamicTemplateData: templateData,
  })
}

export async function sendEmailVerificationCode(email: string, code: string): Promise<void> {
  await sendSimpleTemplateEmail(email, {
    intro:
      'Voici votre code de validation pour finaliser votre action sur Afroliya :',
    important: code,
    subject: `Votre code de validation : ${code}`,
  })
}
