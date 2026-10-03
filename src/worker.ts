import { parseNumberedPublications, publicationSourceUrl } from './publicationSource'

type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

const projectSites = [
  { path: '/research/stereopatch', sourcePath: '/stereopatch', legacyPath: '/stereopatch', origin: 'https://yananzhou.me' },
  { path: '/research/patch', sourcePath: '/PATCH', legacyPath: '/PATCH', origin: 'https://yananzhou.me' },
  { path: '/research/trimanpolicy', sourcePath: '/trimanpolicy-site', legacyPath: '/trimanpolicy-site', origin: 'https://cheese-zj.github.io' },
  { path: '/research/nestdex', sourcePath: '/nestdex-site', legacyPath: '/nestdex-site', origin: 'https://cheese-zj.github.io' },
  { path: '/research/autointervene', sourcePath: '/AutoIntervene', legacyPath: '/AutoIntervene', origin: 'https://123qwedsa123.github.io' },
  { path: '/research/mavp', sourcePath: '/mavp', legacyPath: '/mavp', origin: 'https://123qwedsa123.github.io' },
  { path: '/research/saki', sourcePath: '/saki-site', legacyPath: '/saki-site', origin: 'https://cheese-zj.github.io' },
  { path: '/research/core', sourcePath: '/core', legacyPath: '/core', origin: 'https://yananzhou.me' },
]

const movedPreviewSlugs = [
  'sai-dual-robot-collaboration',
  'constraint-aware-streaming-flow',
]

const mergedNestDexPaths = new Set([
  '/research/motion-and-manipulation',
  '/research/motion-and-manipulation/',
  '/research/preview/motion-and-manipulation',
  '/research/preview/motion-and-manipulation/',
])

/* Static assets answer every request with the whole file, but Safari only plays
   <video> from a server that honours byte ranges. Media under /media/ is routed
   through the Worker so it can slice the asset stream into a 206 itself. */
type FixedLengthStreamConstructor = new (length: number) => TransformStream<Uint8Array, Uint8Array>

function parseByteRange(header: string, size: number): [number, number] | 'unsatisfiable' | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  // Multiple or malformed ranges may be ignored: the full file is a valid answer.
  if (!match || (match[1] === '' && match[2] === '')) return null
  if (match[1] === '') {
    const suffix = Number(match[2])
    if (suffix === 0) return 'unsatisfiable'
    return [Math.max(size - suffix, 0), size - 1]
  }
  const start = Number(match[1])
  const end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1)
  if (start >= size || end < start) return 'unsatisfiable'
  return [start, end]
}

function sliceStream(body: ReadableStream<Uint8Array>, start: number, end: number) {
  let offset = 0
  const sliced = body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const from = Math.max(start - offset, 0)
      const to = Math.min(end + 1 - offset, chunk.byteLength)
      offset += chunk.byteLength
      if (from < to) controller.enqueue(chunk.subarray(from, to))
      if (offset > end) controller.terminate()
    },
  }))
  // A fixed-length body lets the runtime send Content-Length rather than chunks.
  const FixedLengthStream = (globalThis as { FixedLengthStream?: FixedLengthStreamConstructor }).FixedLengthStream
  if (!FixedLengthStream) return sliced
  const fixed = new FixedLengthStream(end - start + 1)
  void sliced.pipeTo(fixed.writable).catch(() => {})
  return fixed.readable
}

/* Inside the Worker, asset responses carry no Content-Length, yet a 206 must
   state the file's full size. Each file is measured once per isolate by
   counting its stream (constant memory), and remembered by ETag. */
const mediaSizes = new Map<string, number>()

async function measureStream(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader()
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return size
    size += value.byteLength
  }
}

async function serveMedia(request: Request, env: Env) {
  const range = request.headers.get('Range')
  const assetHeaders = new Headers(request.headers)
  assetHeaders.delete('Range')
  const fetchAsset = (method = request.method) => env.ASSETS.fetch(new Request(request.url, { method, headers: assetHeaders }))
  let asset = await fetchAsset()
  if (asset.status !== 200) return asset

  const headers = new Headers(asset.headers)
  // Assets keep their own revalidating Cache-Control: film files keep their
  // names across cuts, so a browser must never splice ranges from two versions.
  headers.set('Accept-Ranges', 'bytes')
  if (!range) return new Response(asset.body, { status: 200, headers })

  const sizeKey = `${request.url} ${asset.headers.get('ETag') ?? ''}`
  let size = Number(asset.headers.get('Content-Length')) || mediaSizes.get(sizeKey) || 0
  if (!size) {
    // A HEAD has no body to count, so measure a GET of the same file instead.
    const measured = request.method === 'GET' ? asset : await fetchAsset('GET')
    if (measured.status === 200 && measured.body) size = await measureStream(measured.body)
    if (size > 0) mediaSizes.set(sizeKey, size)
    if (request.method === 'GET') {
      asset = await fetchAsset()
      if (asset.status !== 200) return asset
    }
  }

  const bounds = size > 0 ? parseByteRange(range, size) : null
  if (!bounds) return new Response(asset.body, { status: 200, headers })

  headers.delete('Content-Length')
  if (bounds === 'unsatisfiable') {
    void asset.body?.cancel()
    headers.set('Content-Range', `bytes */${size}`)
    return new Response(null, { status: 416, headers })
  }

  const [start, end] = bounds
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`)
  headers.set('Content-Length', String(end - start + 1))
  if (!asset.body) return new Response(null, { status: 206, headers })
  return new Response(sliceStream(asset.body, start, end), { status: 206, headers })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestUrl = new URL(request.url)
    if (requestUrl.hostname === 'www.aus.bot') {
      requestUrl.hostname = 'aus.bot'
      return Response.redirect(requestUrl, 301)
    }

    if (requestUrl.pathname.startsWith('/media/') && (request.method === 'GET' || request.method === 'HEAD')) {
      return serveMedia(request, env)
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

    if (mergedNestDexPaths.has(requestUrl.pathname)) {
      requestUrl.pathname = '/research/nestdex/'
      return Response.redirect(requestUrl, 301)
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
        .replaceAll(`"${projectSite.sourcePath}/`, `"${projectSite.path}/`)
        .replaceAll(`'${projectSite.sourcePath}/`, `'${projectSite.path}/`)
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
