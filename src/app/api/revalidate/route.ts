import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { CALENDAR_TAG } from '@/lib/google-calendar'

// Adding an event in Google Calendar does not show up on the site on its own:
// the fetch is cached for an hour, and Vercel's data cache both survives
// deployments and is skipped at build time, so a redeploy does not refresh it
// either. Opening this route marks the calendar data stale in every region
// (Vercel propagates that within ~300ms); the next page view refetches Google.
//
// Bookmark it with the secret and open it after editing the calendar:
//   https://bctamilcatholicfamily.ca/api/revalidate?secret=...
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  // Nothing to compare against; refuse rather than let anyone refresh at will.
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, error: 'REVALIDATE_SECRET is not set' },
      { status: 500 },
    )
  }

  const provided = new URL(request.url).searchParams.get('secret')
  if (provided !== secret) {
    return NextResponse.json({ revalidated: false, error: 'Invalid secret' }, { status: 401 })
  }

  revalidateTag(CALENDAR_TAG)
  return NextResponse.json({ revalidated: true, tag: CALENDAR_TAG, at: new Date().toISOString() })
}
