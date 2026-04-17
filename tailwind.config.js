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
        bg: 'var(--bg)',
        'bg-secondary': 'var(--bg-secondary)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          blue: '#3B82F6',
          'blue-dark': '#60A5FA',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: { color: '#3B82F6', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            'h1,h2,h3,h4': { color: 'inherit', fontWeight: '700' },
            code: { color: '#e11d48', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '4px', fontSize: '0.875em' },
            'pre code': { color: 'inherit', backgroundColor: 'transparent', padding: 0 },
            blockquote: { borderLeftColor: '#3B82F6', color: 'inherit', fontStyle: 'normal' },
          },
        },
        invert: {
          css: {
            code: { backgroundColor: '#1e1e2e', color: '#f38ba8' },
            blockquote: { borderLeftColor: '#60A5FA' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
