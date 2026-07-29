type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

const projectPath = '/research/trimanpolicy'
const projectOrigin = 'https://cheese-zj.github.io/trimanpolicy-site'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url)

    if (requestUrl.pathname === projectPath) {
      requestUrl.pathname = `${projectPath}/`
      return Response.redirect(requestUrl.toString(), 308)
    }

    if (requestUrl.pathname.startsWith(`${projectPath}/`)) {
      const upstreamPath = requestUrl.pathname.slice(projectPath.length)
      const upstreamUrl = new URL(`${projectOrigin}${upstreamPath}`)
      upstreamUrl.search = requestUrl.search

      return fetch(new Request(upstreamUrl, request))
    }

    return env.ASSETS.fetch(request)
  },
}
