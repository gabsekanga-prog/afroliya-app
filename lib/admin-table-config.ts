export type AdminTableConfig = {
  name: string
  label: string
  primaryKey: string[]
  defaultOrder?: string
  /**
   * Colonnes à afficher dans l'UI d'admin.
   * Sert de fallback quand la récupération du schéma échoue (ex: tables vides).
   */
  columns?: string[]
}

export const ADMIN_TABLES: AdminTableConfig[] = [
  {
    name: 'restaurants',
    label: 'Restaurants',
    primaryKey: ['id'],
    defaultOrder: 'created_at',
    columns: [
      'id',
      'name',
      'address',
      'created_at',
      'website_url',
      'google_maps_link',
      'description',
      'bookable',
      'google_quotation',
      'google_review_total_value',
      'city',
      'address_line1',
      'postal_code',
      'country_code',
      'latitude',
      'longitude',
      'instagram_url',
      'facebook_url',
      'whatsapp_phone',
      'phone',
      'email',
      'sponsored',
    ],
  },
  {
    name: 'reservations',
    label: 'Reservations',
    primaryKey: ['id'],
    defaultOrder: 'created_at',
    columns: [
      'id',
      'restaurant_id',
      'client_name',
      'client_email',
      'booking_date',
      'booking_time',
      'group_size',
      'created_at',
      'remarks',
      'client_phone',
      'status',
      'updated_at',
      'public_code',
      'public_code_expires_at',
    ],
  },
  {
    name: 'reservation_messages',
    label: 'Reservation messages',
    primaryKey: ['id'],
    defaultOrder: 'created_at',
    columns: ['id', 'created_at', 'reservation_id', 'sender_type', 'message'],
  },
  {
    name: 'guides',
    label: 'Guides',
    primaryKey: ['id'],
    defaultOrder: 'updated_at',
    columns: [
      'id',
      'slug',
      'title',
      'image_src',
      'image_alt',
      'excerpt',
      'body',
      'sort_order',
      'published',
      'created_at',
      'updated_at',
      'intro',
      'subsections',
    ],
  },
  {
    name: 'newsletter',
    label: 'Newsletter',
    primaryKey: ['id'],
    defaultOrder: 'opt_in_date',
    columns: ['id', 'email', 'first_name', 'opt_in_date', 'is_active'],
  },
  {
    name: 'partner_applications',
    label: 'Demandes partenaires',
    primaryKey: ['id'],
    defaultOrder: 'created_at',
    columns: [
      'id',
      'created_at',
      'restaurant',
      'restaurant_details',
      'offer',
      'contact_name',
      'phone',
      'email',
    ],
  },
  {
    name: 'cuisines',
    label: 'Cuisines',
    primaryKey: ['key'],
    defaultOrder: 'created_at',
    columns: ['created_at', 'key', 'description'],
  },
  {
    name: 'restaurant_cuisines',
    label: 'Restaurant cuisines',
    primaryKey: ['restaurant_id', 'cuisine_key'],
    defaultOrder: 'created_at',
    columns: ['created_at', 'restaurant_id', 'cuisine_key'],
  },
  {
    name: 'restaurant_deals',
    label: 'Restaurant deals',
    primaryKey: ['id'],
    columns: [
      'title',
      'description',
      'validity_text',
      'is_active',
      'sort_order',
      'restaurant_id',
      'id',
    ],
  },
  {
    name: 'restaurant_feature_links',
    label: 'Restaurant feature links',
    primaryKey: ['restaurant_id', 'feature_key'],
    columns: ['restaurant_id', 'feature_key'],
  },
  {
    name: 'restaurant_features',
    label: 'Restaurant features',
    primaryKey: ['id'],
    columns: ['key', 'label', 'sort_order', 'is_active', 'id'],
  },
  {
    name: 'restaurant_images',
    label: 'Restaurant images',
    primaryKey: ['restaurant_id', 'image_url'],
    defaultOrder: 'created_at',
    columns: [
      'created_at',
      'restaurant_id',
      'image_url',
      'cover',
      'description',
    ],
  },
  {
    name: 'restaurant_opening_slots',
    label: 'Restaurant opening slots',
    primaryKey: ['id'],
    defaultOrder: 'sort_order',
    columns: [
      'restaurant_id',
      'day',
      'open_time',
      'close_time',
      'sort_order',
      'id',
    ],
  },
  {
    name: 'restaurant_photos_menu',
    label: 'Restaurant photos menu',
    primaryKey: ['id'],
    defaultOrder: 'created_at',
    columns: [
      'created_at',
      'restaurant_id',
      'image_src',
      'caption',
      'sort_order',
      'published',
      'id',
    ],
  },
]

export function getAdminTableConfig(
  tableName: string,
): AdminTableConfig | null {
  return ADMIN_TABLES.find((t) => t.name === tableName) ?? null
}
