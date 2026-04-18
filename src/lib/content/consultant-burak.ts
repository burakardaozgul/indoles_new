/**
 * Statik danışman profili — booking ekranı için.
 * Launch-only: Faz 2'de persona-aware dinamik eşleştirme gelecek.
 * Kaynak: src/lib/content/consultants.ts (Faz 2 referansı)
 */
export const BOOKING_CONSULTANT = {
  firstName: 'Burak Arda',
  lastName: 'Özgül',
  titleTR: 'Kurucu & CTO',
  titleEN: 'Founder & CTO',
  photoPath: '/brand/burak.jpg',
  initials: 'BÖ',
} as const;

export type BookingConsultant = typeof BOOKING_CONSULTANT;
