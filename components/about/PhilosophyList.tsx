'use client'

import { motion } from 'motion/react'
import { ease } from '@/components/motion/presets'

type PhilosophyItem = { title: string; desc: string }

// 항목이 화면에 들어오면 차례로 떠오른다
export default function PhilosophyList({ items }: { items: PhilosophyItem[] }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
      {items.map(({ title, desc }, i) => (
        <motion.div
          key={title}
          className="philosophy-item"
          variants={{
            hidden: { opacity: 0, y: 28 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: ease.out, delay: i * 0.14 } },
          }}
        >
          <span className="philosophy-item-num">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <p className="philosophy-item-title">{title}</p>
            <p className="philosophy-item-desc">{desc}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
