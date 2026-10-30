'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

// 스크롤하면 뒤로 기울어진 카드가 앞으로 펴지는 섹션 (Aceternity Container Scroll 참고)
export default function ContainerScroll({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0.05, 0.45], [22, 0])
  const scale = useTransform(scrollYProgress, [0.05, 0.45], [1.04, 1])
  const titleY = useTransform(scrollYProgress, [0.05, 0.45], [40, 0])

  return (
    <section ref={ref} className="container-scroll">
      <motion.div style={{ y: titleY }} className="container-scroll-title">
        {title}
      </motion.div>
      <motion.div style={{ rotateX: rotate, scale }} className="container-scroll-card">
        <div className="container-scroll-screen">{children}</div>
      </motion.div>
    </section>
  )
}
