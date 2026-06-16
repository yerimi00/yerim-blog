import AboutHeroLanding from '@/components/about/AboutHeroLanding'
import { getAllProjects } from '@/lib/projects'

export const metadata = {
  title: 'About — 이예림',
  description: '안녕하세요, 이예림입니다.',
}

export default async function AboutPage() {
  const projects = await getAllProjects()
  const featured = projects.filter(p => p.featured)
  return <AboutHeroLanding featuredProjects={featured} />
}
