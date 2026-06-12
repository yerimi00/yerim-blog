'use client'

import { useState } from 'react'

type Step = 1 | 2 | 3

function StepIndicator({ current }: { current: Step }) {
  const steps = ['약관', '본인확인', '추가정보']
  return (
    <div style={{ display: 'flex', marginBottom: 24 }}>
      {steps.map((label, i) => {
        const n = (i + 1) as Step
        const done = n < current
        const active = n === current
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i > 0 && (
              <div style={{
                position: 'absolute', left: 0, right: '50%', top: 13, height: 2,
                background: done || active ? 'var(--accent)' : 'var(--border, #e5e7eb)',
                transition: 'background 0.3s',
              }} />
            )}
            {i < steps.length - 1 && (
              <div style={{
                position: 'absolute', left: '50%', right: 0, top: 13, height: 2,
                background: done ? 'var(--accent)' : 'var(--border, #e5e7eb)',
                transition: 'background 0.3s',
              }} />
            )}
            <div style={{
              position: 'relative', zIndex: 1,
              width: 28, height: 28, borderRadius: '50%',
              background: done || active ? 'var(--accent)' : 'var(--border, #e5e7eb)',
              color: done || active ? '#fff' : 'var(--text-muted, #9ca3af)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              transition: 'all 0.2s',
            }}>
              {done ? '✓' : n}
            </div>
            <span style={{ fontSize: 11, marginTop: 4, color: active ? 'var(--accent)' : 'var(--text-muted, #9ca3af)', fontWeight: active ? 600 : 400 }}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const TERMS = [
  { key: 't1', label: '[필수] 이용약관 동의' },
  { key: 't2', label: '[필수] 개인정보 처리방침' },
  { key: 't3', label: '[필수] 위치정보 서비스' },
  { key: 'mkt', label: '[선택] 마케팅 정보 수신' },
]

export default function SignupWizardDemo() {
  const [step, setStep] = useState<Step>(1)
  const [terms, setTerms] = useState<Record<string, boolean>>({ t1: false, t2: false, t3: false, mkt: false })
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [showModal, setShowModal] = useState(false)

  const canNext1 = terms.t1 && terms.t2 && terms.t3
  const canNext2 = name.length >= 2 && phone.length >= 10 && (codeSent ? code.length === 6 : false)
  const canSubmit = email.includes('@') && pw.length >= 8

  const allTerms = Object.values(terms).every(Boolean)
  const toggleAll = () => {
    const v = !allTerms
    setTerms({ t1: v, t2: v, t3: v, mkt: v })
  }

  return (
    <div style={{
      width: 320, margin: '0 auto',
      fontFamily: 'Pretendard, sans-serif',
      background: 'var(--surface, #fff)',
      border: '1px solid var(--border, #e5e7eb)',
      borderRadius: 16, padding: 24,
    }}>
      <StepIndicator current={step} />

      {step === 1 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>약관 동의</div>
          <div
            onClick={toggleAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px',
              background: 'var(--surface, #f9fafb)',
              border: '1.5px solid var(--border, #e5e7eb)',
              borderRadius: 10, cursor: 'pointer', marginBottom: 10,
            }}
          >
            <CheckBox checked={allTerms} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>전체 동의</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TERMS.map(t => (
              <div
                key={t.key}
                onClick={() => setTerms(prev => ({ ...prev, [t.key]: !prev[t.key] }))}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 0' }}
              >
                <CheckBox checked={terms[t.key]} />
                <span style={{ fontSize: 13, color: 'var(--text, #374151)' }}>{t.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setStep(2)}
              disabled={!canNext1}
              style={{ ...btnStyle(!canNext1), flex: 1 }}
            >
              다음
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>본인확인</div>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="이름"
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input
              value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="010-0000-0000"
              style={{ ...inputStyle, flex: 1, margin: 0 }}
            />
            <button
              onClick={() => setCodeSent(true)}
              disabled={phone.length < 10}
              style={{
                padding: '10px 12px', border: 'none', borderRadius: 'var(--radius-lg)',
                background: phone.length >= 10 ? 'var(--accent)' : 'var(--border)',
                color: '#fff', fontSize: 12, fontWeight: 600, cursor: phone.length >= 10 ? 'pointer' : 'default',
                flexShrink: 0,
              }}
            >
              {codeSent ? '재전송' : '인증'}
            </button>
          </div>
          {codeSent && (
            <input
              value={code} onChange={e => { setCode(e.target.value.slice(0, 6)); if (e.target.value.length === 6) setVerified(true) }}
              placeholder="인증번호 6자리"
              style={{ ...inputStyle, marginTop: 10, borderColor: verified ? '#10b981' : undefined }}
            />
          )}
          {verified && <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>✓ 인증 완료</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => setStep(1)} style={{ ...btnStyle(false), background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>이전</button>
            <button onClick={() => setStep(3)} disabled={!canNext2} style={btnStyle(!canNext2)}>다음</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>추가 정보</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" style={inputStyle} />
          <input value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호 (8자 이상)" type="password" style={{ ...inputStyle, marginTop: 10 }} />
          {pw.length > 0 && pw.length < 8 && (
            <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>비밀번호는 8자 이상이어야 합니다</div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => setStep(2)} style={{ ...btnStyle(false), background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>이전</button>
            <button onClick={() => setShowModal(true)} disabled={!canSubmit} style={btnStyle(!canSubmit)}>가입 완료</button>
          </div>
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'var(--surface, #fff)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px 28px',
            width: 240,
            textAlign: 'center',
            boxShadow: 'var(--shadow-floating)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--accent)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <polyline points="4,13 9,18 20,6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              가입 완료!
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{email}</span>으로<br />
              가입이 완료되었습니다.
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                width: '100%', padding: '11px', border: 'none',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--accent)', color: '#fff',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 'var(--radius-md)', flexShrink: 0,
      border: `2px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
      background: checked ? 'var(--accent)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s',
    }}>
      {checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="1.5,6.5 4.5,9.5 10.5,2.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-lg)',
  border: '1.5px solid var(--border, #e5e7eb)',
  background: 'var(--surface, #fff)',
  fontSize: 13, color: 'var(--text, #111)',
  outline: 'none', boxSizing: 'border-box',
}

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  flex: 1, padding: '12px', border: 'none', borderRadius: 'var(--radius-xl)',
  background: disabled ? 'var(--border)' : 'var(--accent)',
  color: disabled ? 'var(--text-muted)' : '#fff',
  fontSize: 14, fontWeight: 600,
  cursor: disabled ? 'default' : 'pointer',
  marginTop: 0,
})
