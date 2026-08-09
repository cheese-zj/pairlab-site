import { parseNumberedPublications, publicationSourceUrl } from './publicationSource'

type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

const projectSites = [
  { path: '/PATCH', origin: 'https://yananzhou5555.github.io' },
  { path: '/trimanpolicy-site', origin: 'https://cheese-zj.github.io' },
  { path: '/AutoIntervene', origin: 'https://123qwedsa123.github.io' },
]

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url)
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

      const projectUrl = new URL(requestUrl.pathname + requestUrl.search, projectSite.origin)
      return fetch(new Request(projectUrl, request))
    }

    return env.ASSETS.fetch(request)
  },
}
