'use client'

import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { motion } from 'motion/react'
import { fastTween } from '@/components/motion/presets'

export default function CopyButton({ getCode }: { getCode: () => string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const code = getCode()
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      try {
        const el = document.createElement('textarea')
        el.value = code
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.focus()
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        console.error('[CopyButton] 복사 실패. code length:', code.length)
      }
    }
  }

  return (
    <motion.button
      onClick={copy}
      title={copied ? '복사됨!' : '코드 복사'}
      initial={false}
      animate={{
        background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
        borderColor: copied ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.12)',
        color: copied ? '#22c55e' : '#9ca3af',
      }}
      transition={fastTween}
      style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        zIndex: 2,
        padding: '3px 8px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.7rem',
        fontFamily: 'Pretendard, sans-serif',
        lineHeight: 1,
      }}
    >
      {copied ? <FiCheck size={11} /> : <FiCopy size={11} />}
      {copied ? '복사됨' : '복사'}
    </motion.button>
  )
}
