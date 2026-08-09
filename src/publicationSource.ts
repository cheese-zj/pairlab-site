import type { Publication } from './publications'

export const publicationSourceUrl = 'https://www.weimingzhi.com/publication-list'

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
}

function plainText(fragment: string) {
  return decodeHtml(fragment.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim()
}

function parseList(listHtml: string): Publication[] {
  const items = [...listHtml.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]

  return items.map((match, index) => {
    const itemHtml = match[1]
    const citationMatch = plainText(itemHtml).match(/^\[\s*([^\]]+?)\s*\]\s*(.+)$/)
    if (!citationMatch) throw new Error(`Could not parse numbered publication ${index + 1}`)

    const venue = citationMatch[1]
      .replace(/(\d)\s+(?=\d)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
    const yearMatch = venue.match(/\b(20\s*\d{2})\b/)
    if (!yearMatch) throw new Error(`Could not find a year in numbered publication ${index + 1}`)

    const linkMatch = itemHtml.match(/<a\b[^>]*href="([^"]+)"/i)
    return {
      id: String(index + 1).padStart(2, '0'),
      year: Number(yearMatch[1].replace(/\s/g, '')),
      venue,
      citation: citationMatch[2].trim(),
      ...(linkMatch ? { url: decodeHtml(linkMatch[1]) } : {}),
    }
  })
}

export function parseNumberedPublications(html: string) {
  const orderedLists = [...html.matchAll(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi)]
    .map((match) => parseList(match[1]))
    .filter((items) => items.length > 0)

  const publications = orderedLists.sort((left, right) => right.length - left.length)[0]
  if (!publications || publications.length < 20) {
    throw new Error('Could not find William Zhi’s numbered publication list')
  }

  return publications
}
