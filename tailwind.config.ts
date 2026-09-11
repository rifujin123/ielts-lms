import type { Config } from 'tailwindcss'
// @ts-expect-error — no types for tailwindcss-animate
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Primary (DOL Crimson Red) ───────────────────────────────
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'on-primary': 'var(--color-on-primary)',
        'primary-container': 'var(--color-primary-container)',
        'on-primary-container': 'var(--color-on-primary-container)',
        'inverse-primary': 'var(--color-inverse-primary)',
        'primary-fixed': 'var(--color-primary-fixed)',
        'primary-fixed-dim': 'var(--color-primary-fixed-dim)',
        'on-primary-fixed': 'var(--color-on-primary-fixed)',
        'on-primary-fixed-variant': 'var(--color-on-primary-fixed-variant)',

        // ── Secondary (Slate) ───────────────────────────────────────
        secondary: 'var(--color-secondary)',
        'on-secondary': 'var(--color-on-secondary)',
        'secondary-container': 'var(--color-secondary-container)',
        'on-secondary-container': 'var(--color-on-secondary-container)',
        'secondary-fixed': 'var(--color-secondary-fixed)',
        'secondary-fixed-dim': 'var(--color-secondary-fixed-dim)',
        'on-secondary-fixed': 'var(--color-on-secondary-fixed)',
        'on-secondary-fixed-variant': 'var(--color-on-secondary-fixed-variant)',

        // ── Tertiary (Emerald Green) ────────────────────────────────
        tertiary: 'var(--color-tertiary)',
        'on-tertiary': 'var(--color-on-tertiary)',
        'tertiary-container': 'var(--color-tertiary-container)',
        'on-tertiary-container': 'var(--color-on-tertiary-container)',
        'tertiary-fixed': 'var(--color-tertiary-fixed)',
        'tertiary-fixed-dim': 'var(--color-tertiary-fixed-dim)',
        'on-tertiary-fixed': 'var(--color-on-tertiary-fixed)',
        'on-tertiary-fixed-variant': 'var(--color-on-tertiary-fixed-variant)',

        // ── Surface ─────────────────────────────────────────────────
        surface: 'var(--color-surface)',
        'surface-dim': 'var(--color-surface-dim)',
        'surface-bright': 'var(--color-surface-bright)',
        'surface-container-lowest': 'var(--color-surface-container-lowest)',
        'surface-container-low': 'var(--color-surface-container-low)',
        'surface-container': 'var(--color-surface-container)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'surface-container-highest': 'var(--color-surface-container-highest)',
        'surface-variant': 'var(--color-surface-variant)',
        'surface-tint': 'var(--color-surface-tint)',

        // ── On-surface ──────────────────────────────────────────────
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        'inverse-surface': 'var(--color-inverse-surface)',
        'inverse-on-surface': 'var(--color-inverse-on-surface)',
        background: 'var(--color-background)',
        'on-background': 'var(--color-on-background)',

        // ── Outline ─────────────────────────────────────────────────
        outline: 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',

        // ── Error ───────────────────────────────────────────────────
        error: 'var(--color-error)',
        'on-error': 'var(--color-on-error)',
        'error-container': 'var(--color-error-container)',
        'on-error-container': 'var(--color-on-error-container)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-default)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: '9999px',
      },

      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },

      fontSize: {
        'display-hero': [
          '40px',
          { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '800' },
        ],
        'display-hero-mobile': [
          '30px',
          { lineHeight: '38px', letterSpacing: '-0.015em', fontWeight: '800' },
        ],
        'headline-lg': [
          '28px',
          { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        'headline-lg-mobile': [
          '22px',
          { lineHeight: '30px', letterSpacing: '-0.01em', fontWeight: '700' },
        ],
        'headline-md': [
          '20px',
          { lineHeight: '28px', letterSpacing: '-0.015em', fontWeight: '700' },
        ],
        'headline-sm': [
          '16px',
          { lineHeight: '24px', letterSpacing: '-0.005em', fontWeight: '600' },
        ],
        'body-lg': ['16px', { lineHeight: '26px', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '18px', letterSpacing: '0.005em', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '700' }],
        'metric-band': [
          '36px',
          { lineHeight: '40px', letterSpacing: '-0.03em', fontWeight: '800' },
        ],
      },

      spacing: {
        'space-2xs': '0.25rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        gutter: '1.5rem',
        'margin-mobile': '1rem',
        'margin-desktop': '2rem',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config
