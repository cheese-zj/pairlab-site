type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url)
    if (requestUrl.pathname === '/publications' || requestUrl.pathname.startsWith('/publications/')) {
      return Response.redirect(new URL('/research', requestUrl), 301)
    }

    return env.ASSETS.fetch(request)
  },
}
