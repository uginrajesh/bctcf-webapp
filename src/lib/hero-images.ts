import fs from 'node:fs'
import path from 'node:path'

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i

// Reads public/hero/ at build time and returns the public paths of any images
// found there. Drop photos into public/hero/ and they appear in the hero
// carousel on the next deploy. Returns [] if the folder is missing or empty
// (the hero then falls back to the gradient background).
export function getHeroImages(): string[] {
  try {
    const dir = path.join(process.cwd(), 'public', 'hero')
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_RE.test(f))
      .sort()
      .map((f) => `/hero/${f}`)
  } catch {
    return []
  }
}
