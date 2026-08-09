import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/research', label: 'Research' },
  { to: '/people', label: 'People' },
  { to: '/join', label: 'Join' },
]

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 90)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`route-header${collapsed ? ' collapsed' : ''}${open ? ' open' : ''}`}>
      <Link to="/" className="route-brand" aria-label="PAIR Lab home" onClick={() => setOpen(false)}>
        <img src="/pairlab-mark-flat.png" alt="" aria-hidden="true" />
      </Link>
      <nav aria-label="Main navigation">
        {links.map((link) => (
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
