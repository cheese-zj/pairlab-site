import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const secondaryLinks = [
  { to: '/people', label: 'People' },
  { to: '/join', label: 'Join' },
]

function SiteHeader() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [activeResearchSection, setActiveResearchSection] = useState('showcase')
  const isResearchPage = pathname === '/research'

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 90)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isResearchPage) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveResearchSection(entry.target.id)
      })
    }, { rootMargin: '-35% 0px -55%', threshold: 0 })

    const sections = ['showcase', 'publications']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isResearchPage])

  return (
    <header className={`route-header${collapsed && !isResearchPage ? ' collapsed' : ''}${open ? ' open' : ''}`}>
      <Link to="/" className="route-brand" aria-label="PAIR Lab home" onClick={() => setOpen(false)}>
        <img src="/pairlab-mark-flat.png" alt="" aria-hidden="true" />
      </Link>
      <nav aria-label="Main navigation">
        <NavLink to="/research" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>
          Research
        </NavLink>
        {isResearchPage ? (
          <div className="route-research-sections" role="group" aria-label="Research sections">
            <a
              className={activeResearchSection === 'showcase' ? 'section-active' : ''}
              href="#showcase"
              aria-current={activeResearchSection === 'showcase' ? 'location' : undefined}
              onClick={() => {
                setActiveResearchSection('showcase')
                setOpen(false)
              }}
            >
              Showcase
            </a>
            <a
              className={activeResearchSection === 'publications' ? 'section-active' : ''}
              href="#publications"
              aria-current={activeResearchSection === 'publications' ? 'location' : undefined}
              onClick={() => {
                setActiveResearchSection('publications')
                setOpen(false)
              }}
            >
              Publications
            </a>
          </div>
        ) : null}
        {secondaryLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button className="route-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
    </header>
  )
}

export default SiteHeader
