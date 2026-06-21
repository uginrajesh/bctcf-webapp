export type NavKey =
  | 'home' | 'about' | 'events' | 'prayer' | 'members' | 'socials' | 'contact'

export const NAV_ITEMS: { key: NavKey; href: string }[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'events', href: '/events' },
  { key: 'prayer', href: '/prayer-requests' },
  { key: 'members', href: '/new-members' },
  { key: 'socials', href: '/socials' },
  { key: 'contact', href: '/contact' },
]

export const SITE = {
  email: 'bctamilcatholicfamily@gmail.com',
  socials: {
    // TODO(content): replace with real URLs before launch (Open Item #3)
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
    whatsapp: 'https://chat.whatsapp.com/',
  },
  // TODO(content): replace with real Google Maps embed URL (Open Item #5)
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83000!2d-123.1!3d49.25',
} as const
