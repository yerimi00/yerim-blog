'use client'

import AboutVersionContent from './AboutVersionContent'
import AboutToc from './AboutToc'
import type { AboutVersion } from './AboutIntro'
import type { Activity } from '@/lib/notion'

const VERSIONS: AboutVersion[] = ['fe', 'be', 'pm']

export default function AboutVersionSwiper({
  initialVersion,
  activities,
}: {
  initialVersion: string
  activities: Activity[]
}) {
  const version = (VERSIONS.includes(initialVersion as AboutVersion)
    ? initialVersion
    : 'fe') as AboutVersion

  return (
    <>
      <AboutToc key={version} />
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <AboutVersionContent version={version} activities={activities} />
      </main>
    </>
  )
}
