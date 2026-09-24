export type NewsItem = {
  /** Stable identifier; keep it unchanged when correcting an announcement. */
  id: string
  /** Actual announcement date, YYYY-MM-DD. Do not use an inferred paper date. */
  date: string
  title: string
  summary?: string
  /** Optional project, paper, event, or other authoritative destination. */
  href?: string
}

// Add approved announcements here. Kept empty until real news is supplied;
// the homepage renders a neutral empty state instead of fabricated milestones.
export const newsItems: NewsItem[] = [
  { id: 'corl-2026-acceptances', date: '2026-09-24', title: '4 papers accepted at CoRL 2026! 🎉' },
]

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}
