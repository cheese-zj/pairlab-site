import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { replayIntro } from '../introReplay'

const navLinks = [
  { to: '/research', label: 'Research' },
  { to: '/publications', label: 'Publications' },
  { to: '/videos', label: 'Videos' },
  { to: '/people', label: 'People' },
  { to: '/join', label: 'Join' },
]

const lightGroundRoutes = new Set(['/research', '/people', '/join'])

/* The bar always stands on its own ground; routes only pick which one —
   light routes open on cream, everything else on ink. */
function barGroundFor(pathname: string) {
  if (pathname.startsWith('/research/preview/')) return 'dark'
  return lightGroundRoutes.has(pathname) ? 'light' : 'dark'
}

function SiteHeader() {
  const { pathname } = useLocation()
  const [pinned, setPinned] = useState(false)
  const ground = barGroundFor(pathname)
  /* On the homepage the bar floats as a thin veil over the intro and only
     takes its ink ground once the page starts to scroll. */
  const overlay = pathname === '/' && !pinned

  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`site-nav${pinned ? ' is-pinned' : ''}${overlay ? ' is-overlay' : ''}`}
      data-ground={ground}
    >
      <div className="site-nav-inner">
        <Link
          className="site-nav-brand"
          to="/"
          aria-label="PAIR Lab home"
          /* Already home: the logo replays the intro instead of a no-op reload. */
          onClick={pathname === '/' ? (event) => { event.preventDefault(); replayIntro() } : undefined}
        >
          <img src="/pairlab-mark-flat.png" alt="" aria-hidden="true" />
          <span>PAIR Lab</span>
        </Link>
        <nav aria-label="Main">
          {navLinks.map((link) => {
            // Project previews belong to Research.
            const isActive = pathname === link.to || (link.to === '/research' && pathname.startsWith('/research/'))

            return (
              <Link
                key={link.to}
                to={link.to}
                className={isActive ? 'is-active' : ''}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
