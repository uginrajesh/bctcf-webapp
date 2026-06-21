import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1e3a8a',
          blueDark: '#16275e',
          gold: '#b8860b',
          orange: '#f59e0b',
          yellow: '#ffe9a8',
          cream: '#fffdf7',
          creamDark: '#fbf7ed',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        tamil: ['var(--font-tamil)', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2a4ba0 60%, #b8860b 135%)',
      },
    },
  },
  plugins: [],
} satisfies Config
