import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import 'highlight.js/styles/github.css'
import MobileBlockModal from '@/components/MobileBlockModal'

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
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||((t==='system'||!t)&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}` }} />
        <script dangerouslySetInnerHTML={{
          __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js'); }); }`
        }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MobileBlockModal />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
