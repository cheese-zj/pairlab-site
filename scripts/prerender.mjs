import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const projectRoot = process.cwd()
const outputDirectory = join(projectRoot, 'dist')
const serverBundle = join(projectRoot, '.prerender', 'entry-server.js')
const { getSeoData, prerenderPaths, render, siteUrl } = await import(pathToFileURL(serverBundle).href)
const template = await readFile(join(outputDirectory, 'index.html'), 'utf8')

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function renderSeo(pathname) {
  const seo = getSeoData(pathname)
  const canonical = `${siteUrl}${seo.path === '/' ? '' : seo.path}`
  const image = `${siteUrl}${seo.image ?? '/pairlab-emblem.png'}`
  const tags = [
    `<title>${escapeAttribute(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(seo.description)}" />`,
    `<meta name="robots" content="${seo.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    '<meta property="og:site_name" content="PAIR Lab" />',
    `<meta property="og:title" content="${escapeAttribute(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(seo.description)}" />`,
    `<meta property="og:type" content="${seo.type ?? 'website'}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    ...seo.structuredData.map((entry) => `<script type="application/ld+json" data-pairlab-schema>${JSON.stringify(entry).replaceAll('<', '\\u003c')}</script>`),
  ]
  return tags.map((tag) => `    ${tag}`).join('\n')
}

function renderDocument(pathname) {
  const markup = render(pathname)
  return template
    .replace(/\s*<!-- pairlab:seo:start -->[\s\S]*?<!-- pairlab:seo:end -->/, `\n${renderSeo(pathname)}\n    <!-- pairlab:seo:end -->`)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
}

for (const pathname of prerenderPaths) {
  const filePath = pathname === '/'
    ? join(outputDirectory, 'index.html')
    : join(outputDirectory, pathname.slice(1), 'index.html')
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, renderDocument(pathname))
}

await writeFile(join(outputDirectory, '404.html'), renderDocument('/404'))

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...prerenderPaths.map((pathname) => `  <url><loc>${siteUrl}${pathname === '/' ? '/' : pathname}</loc></url>`),
  '</urlset>',
  '',
].join('\n')
await writeFile(join(outputDirectory, 'sitemap.xml'), sitemap)

await rm(join(projectRoot, '.prerender'), { recursive: true, force: true })
console.log(`Pre-rendered ${prerenderPaths.length} indexable routes and a custom 404 page.`)
