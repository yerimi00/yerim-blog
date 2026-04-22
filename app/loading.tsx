'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        zIndex: 9999,
      }}
    >
      <DotLottieReact
        src="https://lottie.host/d540ec05-d2be-4f6e-8afd-8b08bcc8925b/NtVfazeykI.lottie"
        loop
        autoplay
        style={{ width: '200px', height: '200px' }}
      />
    </div>
  )
}
