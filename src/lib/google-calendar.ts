export type CalendarEvent = {
  id: string
  title: string
  description: string
  location: string
  start: string
  end: string
  isMass: boolean
}

type GoogleEventItem = {
  id: string
  summary?: string
  description?: string
  location?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
}

export function mapItem(item: GoogleEventItem): CalendarEvent {
  const title = item.summary ?? ''
  return {
    id: item.id,
    title,
    description: item.description ?? '',
    location: item.location ?? '',
    start: item.start?.dateTime ?? item.start?.date ?? '',
    end: item.end?.dateTime ?? item.end?.date ?? '',
    isMass: /holy mass/i.test(title),
  }
}

export async function getUpcomingEvents(max = 10): Promise<CalendarEvent[]> {
  const key = process.env.GOOGLE_CALENDAR_API_KEY
  const calId = process.env.GOOGLE_CALENDAR_ID
  if (!key || !calId) return []
  try {
    const params = new URLSearchParams({
      key,
      timeMin: new Date().toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: String(max),
    })
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calId,
    )}/events?${params.toString()}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = (await res.json()) as { items?: GoogleEventItem[] }
    return (data.items ?? []).map(mapItem)
  } catch {
    return []
  }
}
