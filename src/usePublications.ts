import { useEffect, useState } from 'react'
import { publications } from './publications'
import type { Publication } from './publications'

/* The bundled list renders immediately (and at prerender time); production
   swaps in the worker's freshly scraped copy once it arrives. */
export function usePublications() {
  const [items, setItems] = useState<Publication[]>(publications)

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return

    const controller = new AbortController()
    fetch('/api/publications', { signal: controller.signal })
      .then((response) => response.json() as Promise<Publication[]>)
      .then((freshItems) => setItems(freshItems))
      .catch(() => undefined)

    return () => controller.abort()
  }, [])

  return items
}
