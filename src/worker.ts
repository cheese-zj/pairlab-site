import { parseNumberedPublications, publicationSourceUrl } from './publicationSource'

type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

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

    return env.ASSETS.fetch(request)
  },
}
