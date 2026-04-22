'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DotLottieReact
          src="https://lottie.host/c3e1bb10-8cd3-4610-b958-515cb679f0f7/mbyfgHrwuA.lottie"
          loop
          autoplay
          style={{ width: '320px', height: '320px' }}
        />
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          페이지를 찾을 수 없어요
        </p>
      </main>
      <Footer />
    </>
  )
}
