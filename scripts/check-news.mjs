import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'esbuild'

const { outputFiles } = await build({
  stdin: {
    contents: `
      import { createElement } from 'react'
      import { renderToStaticMarkup } from 'react-dom/server'
      import { MemoryRouter } from 'react-router-dom'
      import HomeNews from './src/components/HomeNews'
      import HomePage from './src/pages/HomePage'
      import SiteHeader from './src/components/SiteHeader'
      import SiteFooter from './src/components/SiteFooter'
      export * from './src/news'
      export const renderNews = (items) => renderToStaticMarkup(createElement(HomeNews, { items }))
      export const renderHome = () => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(HomePage)))
      export const renderChrome = (path) => renderToStaticMarkup(createElement(MemoryRouter,
        { initialEntries: [path] }, createElement(SiteHeader), createElement(SiteFooter)))
    `,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
})
// Bundle renderer and components together so hooks share one React instance.
// A temporary file also keeps failing stack traces readable (no giant data URL).
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'pairlab-news-check-'))
let renderNews, renderHome, renderChrome, newsItems, formatNewsDate
try {
  const bundlePath = join(temporaryDirectory, 'news.cjs')
  writeFileSync(bundlePath, outputFiles[0].text)
  ;({ renderNews, renderHome, renderChrome, newsItems, formatNewsDate } = createRequire(import.meta.url)(bundlePath))
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}

// Homepage composition and route-scoped chrome must survive server rendering.
const home = renderHome()
assert.equal((home.match(/<h1\b/g) ?? []).length, 1)
assert.match(home, /Physical AI &amp; Robotics/)
assert.match(home, /University of Sydney/)
assert.match(home, /src="\/usyd-quadrangle.webp"/)
assert.match(home, /src="\/hero-wordmark-still.webp"/)
assert.match(home, /<canvas[^>]*class="mosaic-flow"/)
assert.doesNotMatch(home, /src="\/hero-wordmark.webp"/, 'SSR starts still for safe hydration and reduced motion')
assert.match(home, /id="news"/)
assert.match(home, /aria-labelledby="home-work-title"/)
assert.equal((home.match(/class="research-project-card/g) ?? []).length, 3, 'Homepage shows the three most recent projects')
assert.match(home, /class="home-foot"/)
assert.doesNotMatch(home, /home-actions|home-research-image|triman-cloth|<video|home-themes|home-latest|home-intro/)
for (const [path, ground] of [['/', 'dark'], ['/research', 'light'], ['/people', 'light'], ['/join', 'light'], ['/research/preview/patch', 'dark'], ['/not-found', 'dark']]) {
  const chrome = renderChrome(path)
  assert.match(chrome, new RegExp(`data-ground="${ground}"`))
  assert.equal(chrome.includes('<canvas'), path !== '/', `Only homepage drops footer mosaic: ${path}`)
  assert.match(chrome, /href="\/research#publications"/)
}

// Validate real content without requiring fake announcements in production.
const ids = new Set()
for (const item of newsItems) {
  assert.ok(item.id.trim() && !ids.has(item.id), `Missing/duplicate news ID: ${item.id}`)
  ids.add(item.id)
  assert.ok(item.title.trim(), `Missing news title: ${item.id}`)
  assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/)
  assert.equal(new Date(`${item.date}T00:00:00Z`).toISOString().slice(0, 10), item.date, `Invalid news date: ${item.id}`)
  if (item.href) {
    const url = new URL(item.href, 'https://aus.bot')
    assert.equal(url.protocol, 'https:', `Unsafe news link: ${item.id}`)
    assert.ok(item.href.startsWith('https://') || /^\/(?!\/)/.test(item.href), `Use an HTTPS or root-relative news link: ${item.id}`)
  }
}

const empty = renderNews([])
assert.match(empty, /aria-labelledby="home-news-title"/)
assert.match(empty, /id="home-news-title">News<\/h2>/)
assert.match(empty, /No announcements yet/)
assert.ok(!empty.includes('<time') && !empty.includes('<ol'))
assert.match(empty, /href="\/research"/)
assert.match(empty, /href="\/people"/)

// Fixtures are test-only, never added to src/news.ts or the published site.
const fixtures = Object.freeze([
  Object.freeze({ id: 'older', date: '2026-01-01', title: 'Older test notice', href: '/research/patch/' }),
  Object.freeze({ id: 'newer', date: '2026-02-03', title: 'Newer <test> notice', summary: 'Text & details', href: 'https://example.org/paper' }),
  Object.freeze({ id: 'plain', date: '2026-01-20', title: 'Unlinked test notice' }),
])
const populated = renderNews(fixtures)
assert.match(populated, /<ol class="home-news-list" role="list">/)
assert.ok(populated.indexOf('Newer &lt;test&gt; notice') < populated.indexOf('Unlinked test notice'))
assert.ok(populated.indexOf('Unlinked test notice') < populated.indexOf('Older test notice'))
assert.match(populated, /Text &amp; details/)
assert.match(populated, /datetime="2026-02-03"/i)
assert.match(populated, /href="\/research\/patch\/"/)
assert.match(populated, /href="https:\/\/example.org\/paper"/)
assert.equal((populated.match(/<li>/g) ?? []).length, 3)
assert.equal((populated.match(/<a href=/g) ?? []).length, 2)
assert.ok(!populated.includes('No announcements yet'))
assert.equal(fixtures[0].id, 'older', 'Rendering must not mutate source order')

const longItem = Object.freeze({
  id: 'long-test-only', date: '2026-02-04',
  title: 'Test fixture: a deliberately long headline about robot learning and manipulation that wraps across multiple lines',
  summary: `Test-only summary for checking readable line lengths and unbroken text: ${'longword'.repeat(16)}`,
  href: '/research',
})
const single = renderNews([longItem])
assert.equal((single.match(/<li>/g) ?? []).length, 1)
assert.match(single, /Test fixture: a deliberately long headline/)
assert.ok(!single.includes('No announcements yet'))

// Optional, ignored visual-review artifacts; never copied into the site build.
if (process.argv.includes('--preview')) {
  const directory = '.pi/artifacts/news-design'
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'fixtures.json'), JSON.stringify({
    single, multiple: renderNews([longItem, ...fixtures]),
  }, null, 2))
}

const previousTimezone = process.env.TZ
try {
  process.env.TZ = 'America/Los_Angeles'
  assert.equal(formatNewsDate('2026-01-01'), '1 Jan 2026')
  process.env.TZ = 'Pacific/Auckland'
  assert.equal(formatNewsDate('2026-01-01'), '1 Jan 2026')
} finally {
  if (previousTimezone === undefined) delete process.env.TZ
  else process.env.TZ = previousTimezone
}
console.log(`Homepage/news checks passed: composition and route chrome; ${newsItems.length} approved items; empty/single/populated rendering, long text, order, links, escaping, and timezone-stable dates.`)
