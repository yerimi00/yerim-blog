import { notFound } from 'next/navigation'
import AboutVersionSwiper from '@/components/about/AboutVersionSwiper'
import { getAllActivities } from '@/lib/notion'
import { getContributionDays } from '@/lib/github'

export function generateStaticParams() {
  return [{ version: 'fe' }, { version: 'be' }, { version: 'pm' }]
}

export async function generateMetadata({ params }: { params: { version: string } }) {
  const labels: Record<string, string> = { fe: 'Frontend', be: 'Backend', pm: '기획자' }
  const label = labels[params.version]
  if (!label) return {}
  return { title: `About — ${label}`, description: '안녕하세요, 이예림입니다.' }
}

export default async function AboutVersionPage({ params }: { params: { version: string } }) {
  if (!['fe', 'be', 'pm'].includes(params.version)) notFound()
  const [activities, contributions] = await Promise.all([getAllActivities(), getContributionDays()])
  return (
    <>
      <AboutVersionSwiper initialVersion={params.version} activities={activities} contributions={contributions} />
    </>
  )
}
