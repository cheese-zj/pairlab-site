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
  ]) {
    const canonical = `https://aus.bot/research/${slug}/`
    const redirect = await worker.fetch(new Request(canonical.slice(0, -1)), env)
    assert.equal(redirect.headers.get('location'), canonical)
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
  console.log('Project proxy checks passed for all five project sites.')
} finally {
  globalThis.fetch = originalFetch
}
