import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { researchProjects } from '../researchProjects'

const navLinks = [
  { to: '/research', label: 'Research' },
  { to: '/people', label: 'People' },
  { to: '/join', label: 'Join' },
]

const researchSections = [
  { id: 'showcase', label: 'Showcase' },
  { id: 'publications', label: 'Publications' },
]

const lightGroundRoutes = new Set(['/research', '/people', '/join'])

/**
 * How the bar should sit on this route before any scrolling.
 *
 * `ground` picks the type colour: light routes open on cream, everything else on
 * a dark photograph or field. `opaque` is the exception — a couple of project
 * heroes are light method diagrams rather than photographs, and no scrim carries
 * white type over those, so the bar takes its own ground instead.
 */
function barStateFor(pathname: string) {
  const previewMatch = pathname.match(/^\/research\/preview\/(.+)$/)
  if (previewMatch) {
    const project = researchProjects.find((item) => item.slug === previewMatch[1])
    return { ground: 'dark', opaque: project?.heroTone === 'bright' }
  }
  return { ground: lightGroundRoutes.has(pathname) ? 'light' : 'dark', opaque: false }
}

function SiteHeader() {
  const { pathname } = useLocation()
  const [pinned, setPinned] = useState(false)
  const [activeSection, setActiveSection] = useState(researchSections[0].id)
  const { ground, opaque } = barStateFor(pathname)
  const isResearchPage = pathname === '/research'

  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isResearchPage) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id)
      })
    }, { rootMargin: '-35% 0px -55%', threshold: 0 })

    const observed = researchSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element))

    observed.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [isResearchPage])

  return (
    <header
      className={`site-nav${pinned ? ' is-pinned' : ''}${opaque ? ' is-opaque' : ''}`}
      data-ground={ground}
    >
      <div className="site-nav-inner">
        <Link className="site-nav-brand" to="/" aria-label="PAIR Lab home">
          <img src="/pairlab-mark-flat.png" alt="" aria-hidden="true" />
          <span>PAIR Lab</span>
        </Link>
        {/* On the research page its two sections ride along in the bar. */}
        {isResearchPage ? (
          <nav className="site-nav-sections" aria-label="Research sections">
            {researchSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={activeSection === section.id ? 'is-active' : ''}
                aria-current={activeSection === section.id ? 'location' : undefined}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </a>
            ))}
          </nav>
        ) : null}
        {/* Three destinations fit at every width, so there is no menu to open. */}
        <nav aria-label="Main">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'is-active' : ''}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
