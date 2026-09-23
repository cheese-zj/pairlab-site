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
  console.log('Project proxy checks passed for all seven project sites, including MAVP and SAKI video ranges and missing assets.')
} finally {
  globalThis.fetch = originalFetch
}
