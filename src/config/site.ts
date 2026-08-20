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
  // Canonical origin. Used for metadataBase, canonical/hreflang links, the
  // sitemap and robots.txt -- so social previews and search results point at
  // the real domain rather than the deploy-specific vercel.app URL.
  url: 'https://bctamilcatholicfamily.ca',
  email: 'bctamilcatholicfamily@gmail.com',
  // Not published yet -- see isPublishedUrl below for what counts as a real
  // link. Until one is set, the card renders disabled with a "Coming Soon"
  // badge. Paste our own page or invite URL here and that card goes live;
  // nothing else needs to change.
  socials: {
    facebook: '',
    instagram: '',
    youtube: '',
    whatsapp: '',
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

// A social link only counts as published when it points at *our* page, not at
// the platform's front door: "https://facebook.com/" is a perfectly valid URL
// that reaches nobody, so it stays a placeholder. The distinguishing signal is
// a non-empty path -- a profile handle, channel, or invite code.
export function isPublishedUrl(url: string): boolean {
  if (!url.trim()) return false
  try {
    return new URL(url).pathname.replace(/\/+$/, '') !== ''
  } catch {
    return false
  }
}
