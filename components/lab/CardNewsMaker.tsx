'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { parseCards, type Card } from '@/lib/card-news'
import { SITE_DOMAIN_NAME } from '@/lib/site'
import { DEFAULT_VIEW, DESIGNS, H, W, drawCard, type DesignId, type ImageView, type Kind } from './card-designs'

const PLACEHOLDER = `# 표지 **제목**
---
# 두 번째 카드 제목
> 강조하고 싶은 문장
![](https://이미지-주소.png)
본문을 적어요.
\`\`\`js
console.log('코드는 다크 터미널 디자인에서 보여요')
\`\`\`
---
뉴스 기사는 그대로 붙여넣어도 돼요. --- 가 없으면 문단(빈 줄) 단위로 카드가 나뉘어요.`

type CardCanvasProps = {
  card: Card
  kind: Kind
  index: number
  total: number
  design: DesignId
  sharedImage: HTMLImageElement | null
  avatar: HTMLImageElement | null
  /** 직접 고른 포인트 색. null이면 블로그 강조색(--accent) */
  pickedAccent: string | null
  version: string
}

function CardCanvas({ card, kind, index, total, design, sharedImage, avatar, pickedAccent, version }: CardCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  // ponytail: 카드별 업로드는 카드 순서(이 컴포넌트의 key=index)에 붙는다. 카드를 옮기면 이미지는 자리에 남음
  const [uploaded, setUploaded] = useState<HTMLImageElement | null>(null)
  const [textImage, setTextImage] = useState<HTMLImageElement | null>(null)
  const image = uploaded ?? textImage ?? sharedImage
  const [view, setView] = useState<ImageView>(DEFAULT_VIEW)
  const [adjusting, setAdjusting] = useState(false)
  const patch = (p: Partial<ImageView>) => setView((v) => ({ ...v, ...p }))

  useEffect(() => {
    let alive = true
    setTextImage(null)
    if (card.image) loadImage(card.image).then((img) => alive && setTextImage(img))
    return () => { alive = false }
  }, [card.image])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // 글꼴이 늦게 로드되면 대체 글꼴로 그려지므로 먼저 기다린다
    Promise.all([
      document.fonts.load('700 60px Pretendard'),
      document.fonts.load('400 30px Pretendard'),
      document.fonts.load('400 24px "JetBrains Mono"'),
    ])
      .catch(() => undefined)
      .then(() => {
        const accent = pickedAccent ?? getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
        drawCard(canvas, design, { card, kind, index, total, image, avatar, accent, customAccent: !!pickedAccent, view })
      })
  }, [card, kind, index, total, design, image, avatar, pickedAccent, view, version])

  const download = () => {
    ref.current?.toBlob((blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `card-${String(index + 1).padStart(2, '0')}.png`
      a.click()
      // 클릭 직후 바로 해제하면 Safari에서 저장이 끊길 수 있다
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    }, 'image/png')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <canvas
        ref={ref}
        width={W}
        height={H}
        aria-label={`카드 ${index + 1}: ${card.title || card.body}`}
        style={{ width: '100%', height: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
      />
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button type="button" onClick={download} style={{ ...buttonStyle, flex: 1 }}>
          PNG 저장
        </button>
        <button
          type="button"
          onClick={() => (uploaded ? setUploaded(null) : fileRef.current?.click())}
          style={buttonStyle}
        >
          {uploaded ? '이미지 빼기' : '이미지'}
        </button>
        {image && (
          <button type="button" aria-expanded={adjusting} onClick={() => setAdjusting((a) => !a)} style={buttonStyle}>
            조절
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pickImage(e, setUploaded)} />
      </div>
      {image && adjusting && (
        <div role="group" aria-label={`카드 ${index + 1} 이미지 조절`} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Slider label="크기" min={0.5} max={3} step={0.05} value={view.zoom} onChange={(zoom) => patch({ zoom })} />
          <Slider label="가로" min={-0.5} max={0.5} step={0.01} value={view.x} onChange={(x) => patch({ x })} />
          <Slider label="세로" min={-0.5} max={0.5} step={0.01} value={view.y} onChange={(y) => patch({ y })} />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" onClick={() => patch({ rotate: (view.rotate + 90) % 360 })} style={{ ...buttonStyle, flex: 1 }}>
              회전 {view.rotate}°
            </button>
            <button type="button" aria-pressed={view.flip} onClick={() => patch({ flip: !view.flip })} style={{ ...buttonStyle, flex: 1 }}>
              좌우 반전
            </button>
            <button type="button" onClick={() => setView(DEFAULT_VIEW)} style={buttonStyle}>
              초기화
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Slider({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ width: '2.2rem', flexShrink: 0 }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ flex: 1, minWidth: 0, accentColor: 'var(--accent)' }} />
    </label>
  )
}

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  fontSize: '0.85rem',
  color: 'var(--text)',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
}

// crossOrigin으로 불러와야 캔버스가 오염되지 않아 PNG 저장이 된다. CORS를 막는 이미지는 실패 → null
function loadDirect(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// 원격 이미지는 먼저 Next 이미지 최적화(/_next/image, 같은 출처)로 받는다 — next.config.js remotePatterns(Notion S3·velog CDN 등)에 있는 호스트만 통과.
// 거기 없는 호스트는 직접 시도, 그것도 CORS로 막히면 이미지 없이 그린다
async function loadImage(src: string): Promise<HTMLImageElement | null> {
  if (/^https?:\/\//.test(src)) {
    const viaNext = await loadDirect(`/_next/image?url=${encodeURIComponent(src)}&w=1080&q=85`)
    if (viaNext) return viaNext
  }
  return loadDirect(src)
}

function pickImage(e: React.ChangeEvent<HTMLInputElement>, set: (img: HTMLImageElement | null) => void) {
  const file = e.target.files?.[0]
  if (file) loadDirect(URL.createObjectURL(file)).then(set)
  e.target.value = ''
}

// "에서"까지 붙이면 104px에서 800px을 넘어 글자 단위로 쪼개진다
const OUTRO: Card = { title: `더 많은 이야기는\n**${SITE_DOMAIN_NAME}**`, body: '', quotes: [] }

export default function CardNewsMaker({ initialText }: { initialText: string }) {
  const [text, setText] = useState(initialText)
  const [design, setDesign] = useState<DesignId>('photo')
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [avatar, setAvatar] = useState<HTMLImageElement | null>(null)
  const [pickedAccent, setPickedAccent] = useState<string | null>(null)
  // 색 고르기 칸에 보여 줄 기본 포인트 색 (테마마다 다름)
  const [themeAccent, setThemeAccent] = useState('#e5383b')
  const fileRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme } = useTheme()
  const cards = parseCards(text)
  const all = [...cards, OUTRO]

  // 트윗형 프로필 사진
  useEffect(() => {
    loadDirect('/logo.png').then(setAvatar)
  }, [])

  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    if (/^#[0-9a-f]{6}$/i.test(v)) setThemeAccent(v)
  }, [resolvedTheme])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div role="group" aria-label="디자인 선택" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(Object.keys(DESIGNS) as DesignId[]).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={design === id}
            onClick={() => setDesign(id)}
            style={{
              ...buttonStyle,
              fontWeight: design === id ? 700 : 400,
              color: design === id ? 'var(--accent)' : 'var(--text)',
              borderColor: design === id ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {DESIGNS[id]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          포인트 색
          <input
            type="color"
            value={pickedAccent ?? themeAccent}
            onChange={(e) => setPickedAccent(e.target.value)}
            style={{ width: '2.5rem', height: '2rem', padding: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', cursor: 'pointer' }}
          />
        </label>
        {pickedAccent && (
          <button type="button" onClick={() => setPickedAccent(null)} style={buttonStyle}>
            기본색
          </button>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        aria-label="카드뉴스 내용"
        rows={14}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          fontFamily: 'inherit',
          color: 'var(--text)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          resize: 'vertical',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <button type="button" onClick={() => fileRef.current?.click()} style={buttonStyle}>
          전체 배경 이미지
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => pickImage(e, setImage)} hidden />
        {image && (
          <button type="button" onClick={() => setImage(null)} style={buttonStyle}>
            이미지 빼기
          </button>
        )}
        <span>`# 제목` · 제목 안 `**포인트**` · `&gt; 강조` · `![](이미지 주소)` · ``` 코드(터미널) · `---` 카드 나누기</span>
      </div>

      {cards.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {all.map((card, i) => (
            <CardCanvas
              key={i}
              card={card}
              kind={i === 0 ? 'cover' : i === cards.length ? 'outro' : 'body'}
              index={i}
              total={all.length}
              design={design}
              sharedImage={image}
              avatar={avatar}
              pickedAccent={pickedAccent}
              version={resolvedTheme ?? ''}
            />
          ))}
        </div>
      )}
    </div>
  )
}
