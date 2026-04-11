import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'yerim.dev', template: '%s | yerim.dev' },
  description: '개발과 배움을 기록하는 공간',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://yerim.vercel.app',
    siteName: 'yerim.dev',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
