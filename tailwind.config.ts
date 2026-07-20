import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // "Sanctuary" palette — royal blue + warm gold on cream
        brand: {
          blue: '#1e3a8a',
          blueDark: '#16275e',
          gold: '#c9a227',
          goldSoft: '#e6c766',
          goldLine: '#efe4c8',
          orange: '#e2872f',
          yellow: '#ffe9a8',
          cream: '#fbf7ed',
          creamDark: '#f5ecd8',
          ink: '#2a2e37',
        },
      },
      fontFamily: {
        // Latin uses Inter/Fraunces; Tamil glyphs fall through to the Tamil
        // faces automatically since Inter/Fraunces have no Tamil glyphs.
        sans: ['var(--font-inter)', 'var(--font-catamaran)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'var(--font-noto-serif-tamil)', 'Georgia', 'serif'],
        tamil: ['var(--font-catamaran)', 'var(--font-noto-serif-tamil)', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2a4ba0 60%, #c9a227 135%)',
      },
    },
  },
  plugins: [],
} satisfies Config
