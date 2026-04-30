'use client'

import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const NOTICES = [
  {
    date: '2026. 04. 30',
    title: '비공개 방명록 비밀번호 기능 추가 안내',
    isNew: true,
    content: [
      '비공개 메시지 작성 시 열람 비밀번호를 직접 설정할 수 있습니다.',
      '2026년 4월 30일 이전에 작성된 비공개 방명록 글은 비밀번호가 0000으로 초기화됩니다.',
      '관리자 PIN은 모든 비공개 항목에 대해 마스터 키로 동작합니다.',
      '비밀번호 인증 후 변경이 가능합니다.',
    ],
  },
]

export default function NoticesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <Header />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>
        {/* 상단 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
            공지사항
          </p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.35, margin: 0 }}>
            yerim.dev의 새로운 소식을 알려드립니다
          </h1>
        </div>

        {/* 목록 */}
        <div>
          {NOTICES.map((notice, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                style={{
                  borderTop: '1px solid var(--border)',
                  ...(i === NOTICES.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}),
                }}
              >
                {/* 제목 행 */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '1.5rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)' }}>
                        {notice.title}
                      </span>
                      {notice.isNew && (
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          color: '#fff',
                          background: 'var(--accent)',
                          borderRadius: '999px',
                          padding: '1px 7px',
                          lineHeight: '1.6',
                          flexShrink: 0,
                        }}>
                          신규
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{notice.date}</span>
                  </div>
                  <IoIosArrowDown
                    style={{
                      color: 'var(--text-muted)',
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {/* 본문 */}
                {isOpen && (
                  <div style={{ paddingBottom: '1.5rem' }}>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {notice.content.map((item, j) => (
                        <li key={j} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}
