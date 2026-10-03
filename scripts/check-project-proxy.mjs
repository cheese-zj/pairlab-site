import assert from 'node:assert/strict'
import { build } from 'esbuild'

const { outputFiles } = await build({ entryPoints: ['src/worker.ts'], bundle: true, write: false, format: 'esm', platform: 'node' })
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`)
const originalFetch = globalThis.fetch
const env = { ASSETS: { fetch: () => new Response('asset fallback') } }

try {
  for (const [slug, sourcePath, origin] of [
    ['stereopatch', '/stereopatch', 'https://yananzhou.me'],
    ['patch', '/PATCH', 'https://yananzhou.me'],
    ['trimanpolicy', '/trimanpolicy-site', 'https://cheese-zj.github.io'],
    ['nestdex', '/nestdex-site', 'https://cheese-zj.github.io'],
    ['autointervene', '/AutoIntervene', 'https://123qwedsa123.github.io'],
    ['mavp', '/mavp', 'https://123qwedsa123.github.io'],
    ['saki', '/saki-site', 'https://cheese-zj.github.io'],
    ['core', '/core', 'https://yananzhou.me'],
  ]) {
    const canonical = `https://aus.bot/research/${slug}/`
    const redirect = await worker.fetch(new Request(canonical.slice(0, -1)), env)
    assert.equal(redirect.status, 308)
    assert.equal(redirect.headers.get('location'), canonical)
    const indexRedirect = await worker.fetch(new Request(`${canonical}index.html?v=1`), env)
    assert.equal(indexRedirect.status, 308)
    assert.equal(indexRedirect.headers.get('location'), `${canonical}?v=1`)
    const legacyRedirect = await worker.fetch(new Request(`https://aus.bot${sourcePath}/?v=1`), env)
    assert.equal(legacyRedirect.status, 301)
    assert.equal(legacyRedirect.headers.get('location'), `${canonical}?v=1`)
    globalThis.fetch = async (request) => {
      assert.equal(request.url, `${origin}${sourcePath}/`)
      return new Response(`<head><base href="${sourcePath}/"><link rel="canonical" href="${origin}/"></head><script src='${sourcePath}/assets/app.js'></script>`, { headers: { 'Content-Type': 'text/html' } })
    }
    const html = await (await worker.fetch(new Request(canonical), env)).text()
    assert.ok(html.includes(`<base href="/research/${slug}/">`))
    assert.ok(html.includes(`src='/research/${slug}/assets/app.js'`))
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`))
    assert.equal(html.match(/rel="canonical"/g).length, 1)
    globalThis.fetch = async (request) => {
      assert.equal(request.url, `${origin}${sourcePath}/paper.pdf?v=1`)
      return new Response('pdf bytes', { headers: { 'Content-Type': 'application/pdf' } })
    }
    assert.equal(await (await worker.fetch(new Request(`${canonical}paper.pdf?v=1`), env)).text(), 'pdf bytes')
  }
  globalThis.fetch = async (request) => {
    assert.equal(request.url, 'https://123qwedsa123.github.io/mavp/assets/videos/06-bag-packing.mp4')
    assert.equal(request.headers.get('Range'), 'bytes=0-99')
    return new Response('video chunk', { status: 206, headers: { 'Content-Type': 'video/mp4', 'Content-Range': 'bytes 0-99/1000' } })
  }
  const video = await worker.fetch(new Request('https://aus.bot/research/mavp/assets/videos/06-bag-packing.mp4', { headers: { Range: 'bytes=0-99' } }), env)
  assert.equal(video.status, 206)
  assert.equal(video.headers.get('Content-Range'), 'bytes 0-99/1000')
  assert.equal(await video.text(), 'video chunk')
  globalThis.fetch = async () => new Response('Not found', { status: 404 })
  assert.equal((await worker.fetch(new Request('https://aus.bot/research/mavp/missing.webp'), env)).status, 404)
  assert.equal(await (await worker.fetch(new Request('https://aus.bot/research/preview/mavp/'), env)).text(), 'asset fallback')
  globalThis.fetch = async (request) => {
    assert.equal(request.url, 'https://cheese-zj.github.io/saki-site/assets/overview.mp4?v=1')
    assert.equal(request.headers.get('Range'), 'bytes=100-199')
    return new Response('SAKI video chunk', { status: 206, headers: { 'Content-Type': 'video/mp4', 'Content-Range': 'bytes 100-199/18495750' } })
  }
  const sakiVideo = await worker.fetch(new Request('https://aus.bot/research/saki/assets/overview.mp4?v=1', { headers: { Range: 'bytes=100-199' } }), env)
  assert.equal(sakiVideo.status, 206)
  assert.equal(sakiVideo.headers.get('Content-Range'), 'bytes 100-199/18495750')
  assert.equal(await sakiVideo.text(), 'SAKI video chunk')
  globalThis.fetch = async () => new Response('Not found', { status: 404 })
  assert.equal((await worker.fetch(new Request('https://aus.bot/research/saki/missing.webp'), env)).status, 404)
  assert.equal(await (await worker.fetch(new Request('https://aus.bot/research/preview/saki/'), env)).text(), 'asset fallback')
  globalThis.fetch = async (request) => {
    assert.equal(request.url, 'https://yananzhou.me/core/assets/media/box.mp4')
    assert.equal(request.headers.get('Range'), 'bytes=100-199')
    return new Response('CoRE video chunk', { status: 206, headers: { 'Content-Type': 'video/mp4', 'Content-Range': 'bytes 100-199/5000000' } })
  }
  const coreVideo = await worker.fetch(new Request('https://aus.bot/research/core/assets/media/box.mp4', { headers: { Range: 'bytes=100-199' } }), env)
  assert.equal(coreVideo.status, 206)
  assert.equal(coreVideo.headers.get('Content-Range'), 'bytes 100-199/5000000')
  assert.equal(await coreVideo.text(), 'CoRE video chunk')
  globalThis.fetch = async () => new Response('Not found', { status: 404 })
  assert.equal((await worker.fetch(new Request('https://aus.bot/research/core/missing.webp'), env)).status, 404)
  assert.equal(await (await worker.fetch(new Request('https://aus.bot/research/preview/core/'), env)).text(), 'asset fallback')
  console.log('Project proxy checks passed for all eight project sites, including MAVP, SAKI and CoRE video ranges and missing assets.')

  // Homepage film: the Worker answers byte ranges that static assets ignore.
  const film = '0123456789'
  const assetRequests = []
  const mediaEnv = {
    ASSETS: {
      fetch: async (request) => {
        assetRequests.push(request)
        if (!request.url.endsWith('/media/film.mp4')) return new Response('Not found', { status: 404 })
        const body = request.method === 'HEAD' ? null : film
        return new Response(body, { headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(film.length), ETag: '"film"' } })
      },
    },
  }
  const media = (range, method = 'GET', path = '/media/film.mp4') => worker.fetch(new Request(`https://aus.bot${path}`, { method, headers: range ? { Range: range } : {} }), mediaEnv)

  const probe = await media('bytes=0-1')
  assert.equal(probe.status, 206)
  assert.equal(probe.headers.get('Content-Range'), 'bytes 0-1/10')
  assert.equal(probe.headers.get('Content-Length'), '2')
  assert.equal(probe.headers.get('Accept-Ranges'), 'bytes')
  assert.equal(probe.headers.get('Content-Type'), 'video/mp4')
  assert.equal(await probe.text(), '01')
  assert.equal(assetRequests.at(-1).headers.get('Range'), null, 'Assets are always asked for the whole file')

  const openEnded = await media('bytes=7-')
  assert.equal(openEnded.headers.get('Content-Range'), 'bytes 7-9/10')
  assert.equal(await openEnded.text(), '789')
  const suffix = await media('bytes=-3')
  assert.equal(suffix.headers.get('Content-Range'), 'bytes 7-9/10')
  assert.equal(await suffix.text(), '789')
  const middle = await media('bytes=3-5')
  assert.equal(await middle.text(), '345')
  const clamped = await media('bytes=8-99')
  assert.equal(clamped.headers.get('Content-Range'), 'bytes 8-9/10')
  assert.equal(await clamped.text(), '89')

  const unsatisfiable = await media('bytes=10-')
  assert.equal(unsatisfiable.status, 416)
  assert.equal(unsatisfiable.headers.get('Content-Range'), 'bytes */10')

  const whole = await media(null)
  assert.equal(whole.status, 200)
  assert.equal(whole.headers.get('Accept-Ranges'), 'bytes')
  assert.equal(await whole.text(), film)
  const multiple = await media('bytes=0-1,4-5')
  assert.equal(multiple.status, 200, 'Multipart ranges fall back to the whole file')
  assert.equal(await multiple.text(), film)

  const head = await media('bytes=0-1', 'HEAD')
  assert.equal(head.status, 206)
  assert.equal(head.headers.get('Content-Range'), 'bytes 0-1/10')
  assert.equal(await head.text(), '')

  assert.equal((await media('bytes=0-1', 'GET', '/media/missing.mp4')).status, 404)

  // The real assets binding omits Content-Length, so the Worker measures the
  // file once (an extra read), then serves later ranges from the remembered size.
  const bareRequests = []
  const bareEnv = {
    ASSETS: {
      fetch: async (request) => {
        bareRequests.push(request.method)
        const chunks = ['0123', '4567', '89']
        const body = request.method === 'HEAD' ? null : new ReadableStream({ pull(controller) { const chunk = chunks.shift(); if (chunk) controller.enqueue(new TextEncoder().encode(chunk)); else controller.close() } })
        return new Response(body, { headers: { 'Content-Type': 'video/mp4', ETag: '"bare"' } })
      },
    },
  }
  const bare = (range, method = 'GET') => worker.fetch(new Request('https://aus.bot/media/bare.mp4', { method, headers: { Range: range } }), bareEnv)
  const measured = await bare('bytes=2-5')
  assert.equal(measured.status, 206)
  assert.equal(measured.headers.get('Content-Range'), 'bytes 2-5/10')
  assert.equal(measured.headers.get('Content-Length'), '4')
  assert.equal(await measured.text(), '2345', 'Slices across chunk boundaries')
  assert.deepEqual(bareRequests, ['GET', 'GET'], 'First range measures, then refetches to serve')
  const remembered = await bare('bytes=-3')
  assert.equal(await remembered.text(), '789')
  assert.deepEqual(bareRequests, ['GET', 'GET', 'GET'], 'Later ranges reuse the measured size')
  const bareHead = await bare('bytes=0-1', 'HEAD')
  assert.equal(bareHead.status, 206)
  assert.equal(bareHead.headers.get('Content-Range'), 'bytes 0-1/10')
  console.log('Media range checks passed: probe, open-ended, suffix, clamped, unsatisfiable, whole-file, HEAD, missing, and size measurement without Content-Length.')
} finally {
  globalThis.fetch = originalFetch
}
