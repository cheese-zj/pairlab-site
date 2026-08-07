type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

const proxiedProjects = [
  {
    path: '/research/trimanpolicy',
    origin: 'https://cheese-zj.github.io/trimanpolicy-site',
  },
  {
    path: '/research/autointervene',
    origin: 'https://123qwedsa123.github.io/AutoIntervene',
  },
]

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url)
    const project = proxiedProjects.find(({ path }) => requestUrl.pathname === path || requestUrl.pathname.startsWith(`${path}/`))

    if (project && requestUrl.pathname === project.path) {
      requestUrl.pathname = `${project.path}/`
      return Response.redirect(requestUrl.toString(), 308)
    }

    if (project) {
      const upstreamPath = requestUrl.pathname.slice(project.path.length)
      const upstreamUrl = new URL(`${project.origin}${upstreamPath}`)
      upstreamUrl.search = requestUrl.search

      return fetch(new Request(upstreamUrl, request))
    }

    return env.ASSETS.fetch(request)
  },
}
