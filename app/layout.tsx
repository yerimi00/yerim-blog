import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import 'highlight.js/styles/github.css'

export const metadata: Metadata = {
  title: { default: 'yerim.dev', template: '%s | yerim.dev' },
  description: '개발과 배움을 기록하는 공간',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'yerim.dev',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://yerim.vercel.app',
    siteName: 'yerim.dev',
  },
  icons: {
    icon: '/profile.jpg',
    apple: '/profile.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js'); }); }`
        }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
