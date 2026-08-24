/* Refreshes the bundled publication snapshot from the live source, using the
   same parser the worker serves /api/publications with — so dev, prerender
   and production first paint all agree with what the worker would scrape.
   Run with: npm run sync:publications */
import { writeFile } from 'node:fs/promises'
import { parseNumberedPublications, publicationSourceUrl } from '../src/publicationSource.ts'

const response = await fetch(publicationSourceUrl)
if (!response.ok) throw new Error(`${publicationSourceUrl} responded ${response.status}`)

const publications = parseNumberedPublications(await response.text())

const file = `export type Publication = {
  id: string
  year: number
  venue: string
  citation: string
  url?: string
}

export const publications: Publication[] = ${JSON.stringify(publications, null, 2)}
`

const target = new URL('../src/publications.ts', import.meta.url)
await writeFile(target, file)
console.log(`Wrote ${publications.length} publications (${publications.at(-1).year}–${publications[0].year}) to src/publications.ts`)
