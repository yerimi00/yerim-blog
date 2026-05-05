/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        serif: ['Pretendard', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        /* CSS custom property aliases */
        bg: 'var(--bg)',
        'bg-secondary': 'var(--bg-secondary)',
        surface: 'var(--surface)',
        'surface-container': 'var(--surface-container)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        'border-subtle': 'var(--border-subtle)',
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        accent: {
          DEFAULT: 'var(--accent)',
          dim: 'var(--accent-dim)',
          blue: '#3B82F6',
          'blue-dark': '#60A5FA',
        },
        /* Design System — Insight Minimalist palette */
        ds: {
          surface: '#f8f9fb',
          'surface-low': '#f3f4f6',
          'surface-container': '#edeef0',
          'surface-high': '#e7e8ea',
          'surface-highest': '#e1e2e4',
          'on-surface': '#191c1e',
          'on-surface-variant': '#424754',
          'inverse-surface': '#2e3132',
          'inverse-on-surface': '#f0f1f3',
          outline: '#727785',
          'outline-variant': '#c2c6d6',
          primary: '#0058be',
          'primary-container': '#2170e4',
          'on-primary': '#ffffff',
          'inverse-primary': '#adc6ff',
          secondary: '#575e70',
          'secondary-container': '#d9dff5',
          'on-secondary': '#ffffff',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontSize: {
        /* Design system typography scale */
        'ds-h1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'ds-h2': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'ds-h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'ds-body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'ds-body': ['1rem', { lineHeight: '1.6' }],
        'ds-label': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        'ds-caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      boxShadow: {
        'ds-floating': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'ds-card': 'none',
      },
      spacing: {
        'ds-xs': '0.25rem',
        'ds-sm': '0.5rem',
        'ds-md': '1rem',
        'ds-lg': '1.5rem',
        'ds-xl': '2rem',
        'ds-2xl': '3rem',
        'ds-3xl': '4rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            lineHeight: '1.75',
            a: { color: '#3B82F6', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            'h1,h2,h3,h4': { color: 'inherit', fontWeight: '700', letterSpacing: '-0.01em' },
            h1: { letterSpacing: '-0.02em', fontWeight: '800' },
            code: { color: '#e11d48', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875em' },
            'pre code': { color: 'inherit', backgroundColor: 'transparent', padding: 0 },
            blockquote: { borderLeftColor: 'var(--outline-variant)', color: 'inherit', fontStyle: 'normal' },
          },
        },
        invert: {
          css: {
            code: { backgroundColor: '#1a1c1e', color: '#f38ba8' },
            blockquote: { borderLeftColor: 'var(--outline-variant)' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
