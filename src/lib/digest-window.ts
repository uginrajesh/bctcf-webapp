export type MassWindow = {
  sendToday: boolean
  sinceISO: string | null
  nextMassISO: string | null
}

export function computeDigestWindow(now: Date, massDatesISO: string[]): MassWindow {
  const nowMs = now.getTime()
  const in24h = nowMs + 24 * 60 * 60 * 1000
  const sorted = [...massDatesISO]
    .map((s) => ({ s, t: new Date(s).getTime() }))
    .filter((x) => !Number.isNaN(x.t))
    .sort((a, b) => a.t - b.t)

  const next = sorted.find((x) => x.t >= nowMs && x.t <= in24h)
  if (!next) return { sendToday: false, sinceISO: null, nextMassISO: null }

  const prev = [...sorted].reverse().find((x) => x.t < next.t && x.t < nowMs)
  return {
    sendToday: true,
    sinceISO: prev ? prev.s : new Date(0).toISOString(),
    nextMassISO: next.s,
  }
}
