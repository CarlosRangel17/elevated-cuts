export interface Stylist {
  id: string
  name: string
  initials: string
  role: string
  badge: string
  specialty: string
  bio: string
  photo: string | null
  /** CSS object-position, tuned per headshot so faces stay in frame under object-cover */
  photoPosition: string
  /** External scheduling page. When omitted the card opens the in-app booking flow. */
  bookingUrl?: string
}

export const STYLISTS: Stylist[] = [
  {
    id: 'evelyn',
    name: 'Evelyn Rodriguez',
    initials: 'ER',
    role: 'Owner · Operator',
    badge: '18+ Yrs Experience',
    specialty: "Men's Precision Haircuts & Fades",
    bio: 'Owner and operator with 18+ years behind the chair. Sharp fades, clean tapers, built to last.',
    photo: '/assets/stylists/evelyn-owner.webp',
    photoPosition: '72% 18%',
  },
  {
    id: 'alexis',
    name: 'Alexis',
    initials: 'AL',
    role: 'Licensed Esthetician',
    badge: 'Skin & Brow Specialist',
    specialty: "Men's Facials · Custom Brow Mapping",
    bio: 'Founder of Brilla by Alexis. Men\'s facials, custom brow mapping, and specialized skin treatments.',
    photo: '/assets/stylists/alexis-facials-stylist.webp',
    photoPosition: '25% 25%',
    bookingUrl: 'https://square.site',
  },
  {
    id: 'angela',
    name: 'Angela',
    initials: 'AN',
    role: 'Stylist',
    badge: 'Stylist',
    specialty: "Men's Cuts · Kids' Cuts",
    bio: "Classic men's cuts and kids' cuts. Walk-ins welcome.",
    photo: '/assets/stylists/angie-stylist.webp',
    photoPosition: '38% 20%',
  },
  {
    id: 'melinda',
    name: 'Melinda',
    initials: 'ME',
    role: 'Stylist',
    badge: 'Stylist',
    specialty: "Men's Cuts · Buzz Cuts · Fades",
    bio: 'Clean, dependable cuts from buzz cuts to fades. Walk-ins welcome.',
    photo: '/assets/stylists/melina-stylist.webp',
    photoPosition: '66% 30%',
  },
  {
    id: 'princess',
    name: 'Princess',
    initials: 'PR',
    role: 'Stylist',
    badge: 'Stylist',
    specialty: "Fades · Men's Cuts · Beard",
    bio: 'Detail-first fades, cuts, and beard work.',
    photo: '/assets/stylists/princess-stylist.webp',
    photoPosition: '55% 40%',
    bookingUrl: 'https://square.site',
  },
  {
    id: 'laura',
    name: 'Laura',
    initials: 'LA',
    role: 'New to the Team',
    badge: 'Now Booking',
    specialty: 'Haircuts · Open Late by Appointment',
    bio: 'Our newest stylist is now taking appointments. Photo coming soon.',
    photo: null,
    photoPosition: '50% 50%',
  },
]
