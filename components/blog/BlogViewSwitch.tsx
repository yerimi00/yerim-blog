import { HiOutlineListBullet, HiOutlineRectangleStack } from 'react-icons/hi2'
import { MotionLink } from '@/components/motion/MotionProvider'
import { fastTween } from '@/components/motion/presets'

const VIEWS = [
  { key: 'list', href: '/blog', label: '목록으로 보기', Icon: HiOutlineListBullet },
  { key: 'series', href: '/blog/series', label: '시리즈로 보기', Icon: HiOutlineRectangleStack },
] as const

// /blog와 /blog/series를 오가는 아이콘 전환 버튼
export default function BlogViewSwitch({ active }: { active: 'list' | 'series' }) {
  return (
    <nav
      aria-label="글 보기 방식"
      style={{ display: 'inline-flex', flexShrink: 0, gap: '2px', padding: '3px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
    >
      {VIEWS.map(({ key, href, label, Icon }) => {
        const isActive = key === active
        return (
          <MotionLink
            key={key}
            href={href}
            title={label}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            whileHover={{ color: 'var(--text)' }}
            transition={fastTween}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.15rem',
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              background: isActive ? 'var(--surface-container)' : 'transparent',
            }}
          >
            <Icon aria-hidden="true" />
          </MotionLink>
        )
      })}
    </nav>
  )
}
