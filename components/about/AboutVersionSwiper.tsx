'use client'

import AboutVersionContent from './AboutVersionContent'
import AboutToc from './AboutToc'
import type { AboutVersion } from './AboutIntro'
import type { Activity } from '@/lib/notion'
import type { ContributionDay } from '@/lib/github'

const VERSIONS: AboutVersion[] = ['fe', 'be', 'pm']

export default function AboutVersionSwiper({
  initialVersion,
  activities,
  contributions,
}: {
  initialVersion: string
  activities: Activity[]
  contributions: ContributionDay[]
}) {
  const version = (VERSIONS.includes(initialVersion as AboutVersion)
    ? initialVersion
    : 'fe') as AboutVersion

  return (
    <>
      <AboutToc key={version} />
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <AboutVersionContent version={version} activities={activities} contributions={contributions} />
      </main>
    </>
  )
}
