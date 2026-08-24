import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

/* Publications is a standing destination in the bar, but it lives on the
   research page — the link just carries the anchor. */
const navLinks = [
  { to: '/research', label: 'Research' },
  { to: '/research#publications', label: 'Publications' },
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
  const [publicationsInView, setPublicationsInView] = useState(false)
  const ground = barGroundFor(pathname)

  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Research and Publications share one page, so the bar tells them apart by
     which part of it is actually on screen; leaving the page clears the flag
     through the observer's own teardown. */
  useEffect(() => {
    if (pathname !== '/research') return

    const target = document.getElementById('publications')
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      setPublicationsInView(entry.isIntersecting)
    }, { rootMargin: '-35% 0px -55%', threshold: 0 })

    observer.observe(target)
    return () => {
      observer.disconnect()
      setPublicationsInView(false)
    }
  }, [pathname])

  return (
    <header
      className={`site-nav${pinned ? ' is-pinned' : ''}`}
      data-ground={ground}
    >
      <div className="site-nav-inner">
        <Link className="site-nav-brand" to="/" aria-label="PAIR Lab home">
          <img src="/pairlab-mark-flat.png" alt="" aria-hidden="true" />
          <span>PAIR Lab</span>
        </Link>
        <nav aria-label="Main">
          {navLinks.map((link) => {
            const isPublications = link.label === 'Publications'
            const isActive = isPublications
              ? pathname === '/research' && publicationsInView
              : link.to === '/research'
                ? (pathname === '/research' && !publicationsInView) || pathname.startsWith('/research/')
                : pathname === link.to

            return (
              <Link
                key={link.to}
                to={link.to}
                className={isActive ? 'is-active' : ''}
                aria-current={isActive ? 'page' : undefined}
                /* Re-clicking while already on the page re-jumps; the router
                   alone would treat it as a no-op navigation. */
                onClick={isPublications && pathname === '/research'
                  ? () => document.getElementById('publications')?.scrollIntoView()
                  : undefined}
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
