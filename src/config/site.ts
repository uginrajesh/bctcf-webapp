export type NavKey =
  | 'home' | 'about' | 'priests' | 'events' | 'prayer' | 'members' | 'socials' | 'contact'

export const NAV_ITEMS: { key: NavKey; href: string }[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'priests', href: '/our-priests' },
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
  // Apps Script Web App URL that saves newsletter subscriber emails to a Google
  // Sheet (see apps-script/newsletter-subscribe.gs). Empty = signup disabled.
  newsletterEndpoint:
    'https://script.google.com/macros/s/AKfycbz4FpnMw92z1eD8rv0qRv5TFqGThEC_edOLrtRtJKCwO4vgS-kj3ysSbFqKG2QPXgX6pQ/exec',
  // Google Form: Mass availability + prayer intentions
  prayerFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSeIUMEFveFcGgmwFVVRWl16Vricy25O7uh7uyctkFmvkWP6VA/viewform',
  // Google Form: New member registration
  newMemberFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSfLdKiIgEPs1bylp3si-e8mSBzL8U4LiRqNo67ONEmixDlbvw/viewform',
} as const
