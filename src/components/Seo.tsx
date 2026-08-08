import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeoData, siteUrl } from '../seo'

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value))
}

function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = getSeoData(pathname)
    const canonicalUrl = `${siteUrl}${seo.path === '/' ? '' : seo.path}`
    const imageUrl = `${siteUrl}${seo.image ?? '/pairlab-emblem.png'}`

    document.title = seo.title
    document.documentElement.lang = 'en-AU'
    upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.noindex ? 'noindex, nofollow' : 'index, follow' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type ?? 'website' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    document.head.querySelectorAll('script[data-pairlab-schema]').forEach((element) => element.remove())
    seo.structuredData.forEach((entry) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.pairlabSchema = 'true'
      script.text = JSON.stringify(entry)
      document.head.appendChild(script)
    })
  }, [pathname])

  return null
}

export default Seo
