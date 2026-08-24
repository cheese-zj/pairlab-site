import { ArrowUpRight } from 'lucide-react'
import type { Publication } from '../publications'

/* One ledger row. An award mention travels as part of the scraped venue
   string, so it is lifted out here and set as a marker chip instead. */
function PublicationRecord({ publication }: { publication: Publication }) {
  const awardMatch = publication.venue.match(/,?\s*(best\s+paper\s+award[^,]*)/i)
  const venueText = awardMatch ? publication.venue.replace(awardMatch[0], '').trim() : publication.venue

  return (
    <article className="publication-record">
      <span className="publication-record-id">{publication.id}</span>
      <div>
        <span className="publication-venue">
          {venueText}
          {awardMatch ? <em className="publication-award">{awardMatch[1].trim()}</em> : null}
        </span>
        <p className="publication-citation">{publication.citation}</p>
      </div>
      {publication.url ? (
        <a href={publication.url} target="_blank" rel="noreferrer" aria-label={`Read ${publication.citation}`}>
          <ArrowUpRight size={19} />
        </a>
      ) : <span className="publication-record-spacer" aria-hidden="true" />}
    </article>
  )
}

export default PublicationRecord
