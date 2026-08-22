import { useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => { finished: Promise<void> }
}

/**
 * Cross-route continuity via the View Transitions API.
 *
 * React Router only wires `viewTransition` into data routers, and this site is a
 * pre-rendered `BrowserRouter`. So we intercept internal link clicks once, in the
 * capture phase: calling `preventDefault()` there makes `Link` skip its own
 * navigation (it checks `defaultPrevented`) while still running any `onClick` the
 * link declares, and we hand the same navigation to `startViewTransition`.
 *
 * A descendant marked `data-morph="<name>"` carries over into the next route,
 * pairing with whichever element on the destination claims the same name.
 */
function RouteTransitions() {
  const navigate = useNavigate()

  useEffect(() => {
    const viewTransitionDocument = document as ViewTransitionDocument
    if (!viewTransitionDocument.startViewTransition) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest?.('a')
      if (!anchor || anchor.hasAttribute('download')) return
      if (anchor.target && anchor.target !== '_self') return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#')) return

      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin) return
      if (destination.pathname === window.location.pathname) return

      event.preventDefault()

      const morph = anchor.querySelector<HTMLElement>('[data-morph]')
      if (morph) morph.style.viewTransitionName = morph.dataset.morph ?? ''

      const transition = viewTransitionDocument.startViewTransition!(() => {
        flushSync(() => {
          navigate(`${destination.pathname}${destination.search}${destination.hash}`)
        })
      })

      transition.finished.finally(() => {
        if (morph) morph.style.viewTransitionName = ''
      })
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate])

  return null
}

export default RouteTransitions
