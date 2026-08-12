import { parseNumberedPublications, publicationSourceUrl } from './publicationSource'

type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

const projectSites = [
  { path: '/research/patch', sourcePath: '/PATCH', legacyPath: '/PATCH', origin: 'https://yananzhou5555.github.io' },
  { path: '/research/trimanpolicy', sourcePath: '/trimanpolicy-site', legacyPath: '/trimanpolicy-site', origin: 'https://cheese-zj.github.io' },
  { path: '/research/nestdex', sourcePath: '/nestdex-site', legacyPath: '/nestdex-site', origin: 'https://cheese-zj.github.io' },
  { path: '/research/autointervene', sourcePath: '/AutoIntervene', legacyPath: '/AutoIntervene', origin: 'https://123qwedsa123.github.io' },
]

const movedPreviewSlugs = [
  'motion-and-manipulation',
  'sai-dual-robot-collaboration',
  'constraint-aware-streaming-flow',
]

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url)
    if (requestUrl.hostname === 'www.aus.bot') {
      requestUrl.hostname = 'aus.bot'
      return Response.redirect(requestUrl, 301)
    }

    if (requestUrl.pathname === '/api/publications') {
      const sourceResponse = await fetch(publicationSourceUrl)
      if (!sourceResponse.ok) {
        return new Response('Publication source unavailable', { status: 502 })
      }

      const publications = parseNumberedPublications(await sourceResponse.text())
      return Response.json(publications, {
        headers: { 'Cache-Control': 'public, max-age=900' },
      })
    }

    if (requestUrl.pathname === '/publications' || requestUrl.pathname.startsWith('/publications/')) {
      return Response.redirect(new URL('/research', requestUrl), 301)
    }

    const projectSite = projectSites.find(({ path }) => requestUrl.pathname === path || requestUrl.pathname.startsWith(`${path}/`))
    if (projectSite) {
      if (requestUrl.pathname === projectSite.path) {
        requestUrl.pathname += '/'
        return Response.redirect(requestUrl, 308)
      }

      if (requestUrl.pathname === `${projectSite.path}/index.html`) {
        requestUrl.pathname = `${projectSite.path}/`
        return Response.redirect(requestUrl, 308)
      }

      const suffix = requestUrl.pathname.slice(projectSite.path.length)
      const projectUrl = new URL(projectSite.sourcePath + suffix + requestUrl.search, projectSite.origin)
      const projectResponse = await fetch(new Request(projectUrl, request))
      if (!projectResponse.headers.get('Content-Type')?.includes('text/html')) return projectResponse

      const canonical = `https://aus.bot${projectSite.path}/`
      const html = (await projectResponse.text())
        .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, '')
        .replace(/<head([^>]*)>/i, `<head$1>\n    <link rel="canonical" href="${canonical}">`)
      const headers = new Headers(projectResponse.headers)
      headers.delete('Content-Encoding')
      headers.delete('Content-Length')

      return new Response(html, {
        status: projectResponse.status,
        statusText: projectResponse.statusText,
        headers,
      })
    }

    const legacyProjectSite = projectSites.find(({ legacyPath }) => requestUrl.pathname === legacyPath || requestUrl.pathname.startsWith(`${legacyPath}/`))
    if (legacyProjectSite) {
      const suffix = requestUrl.pathname.slice(legacyProjectSite.legacyPath.length)

      if (legacyProjectSite.legacyPath === '/PATCH' && suffix !== '' && suffix !== '/' && suffix !== '/index.html') {
        const projectUrl = new URL(requestUrl.pathname + requestUrl.search, legacyProjectSite.origin)
        return fetch(new Request(projectUrl, request))
      }

      requestUrl.pathname = suffix === '/index.html'
        ? `${legacyProjectSite.path}/`
        : `${legacyProjectSite.path}${suffix || '/'}`
      return Response.redirect(requestUrl, 301)
    }

    const movedPreviewSlug = movedPreviewSlugs.find((slug) => requestUrl.pathname === `/research/${slug}` || requestUrl.pathname === `/research/${slug}/`)
    if (movedPreviewSlug) {
      requestUrl.pathname = `/research/preview/${movedPreviewSlug}/`
      return Response.redirect(requestUrl, 301)
    }

    return env.ASSETS.fetch(request)
  },
}
