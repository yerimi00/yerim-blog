import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AboutVersionSwiper from '@/components/about/AboutVersionSwiper'

export function generateStaticParams() {
  return [{ version: 'fe' }, { version: 'be' }, { version: 'pm' }]
}

export async function generateMetadata({ params }: { params: { version: string } }) {
  const labels: Record<string, string> = { fe: 'Frontend', be: 'Backend', pm: '기획자' }
  const label = labels[params.version]
  if (!label) return {}
  return { title: `About — ${label}`, description: '안녕하세요, 이예림입니다.' }
}

export default function AboutVersionPage({ params }: { params: { version: string } }) {
  if (!['fe', 'be', 'pm'].includes(params.version)) notFound()
  return (
    <>
      <Header />
      <AboutVersionSwiper initialVersion={params.version} />
      <Footer />
    </>
  )
}
