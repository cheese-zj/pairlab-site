import { readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const outputDirectory = join(process.cwd(), 'dist')
const maximumAssetBytes = 25 * 1024 * 1024
const maximumAssetCount = 20_000

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collectFiles(path))
    if (entry.isFile()) files.push(path)
  }

  return files
}

const files = await collectFiles(outputDirectory)
const assets = await Promise.all(files.map(async (path) => ({
  path: relative(outputDirectory, path),
  bytes: (await stat(path)).size,
})))

const oversizedAssets = assets.filter(({ bytes }) => bytes > maximumAssetBytes)
const requiredFiles = ['index.html', '404.html', 'sitemap.xml', 'robots.txt', '_headers', 'research/index.html']
const missingRequiredFiles = requiredFiles.filter((path) => !assets.some((asset) => asset.path === path))
const largestAsset = assets.toSorted((a, b) => b.bytes - a.bytes)[0]

if (assets.length > maximumAssetCount) {
  throw new Error(`Cloudflare free-tier asset limit exceeded: ${assets.length} files (maximum ${maximumAssetCount}).`)
}

if (oversizedAssets.length > 0) {
  const details = oversizedAssets.map(({ path, bytes }) => `${path} (${(bytes / 1024 / 1024).toFixed(2)} MiB)`).join(', ')
  throw new Error(`Cloudflare 25 MiB per-file limit exceeded: ${details}`)
}

if (missingRequiredFiles.length > 0) {
  throw new Error(`Required deployment files missing from dist: ${missingRequiredFiles.join(', ')}`)
}

console.log(`Cloudflare asset check passed: ${assets.length} files; largest is ${largestAsset.path} at ${(largestAsset.bytes / 1024 / 1024).toFixed(2)} MiB.`)
