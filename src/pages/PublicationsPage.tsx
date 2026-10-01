import PublicationRecord from '../components/PublicationRecord'
import { usePublications } from '../usePublications'

function PublicationsPage() {
  const publicationItems = usePublications()
  const publicationYears = [...new Set(publicationItems.map((publication) => publication.year))]
  const firstYear = Math.min(...publicationYears)
  const lastYear = Math.max(...publicationYears)

  return (
    <main className="route-page publications-page">
      <header className="page-title">
        <h1>Publications</h1>
      </header>

      {/* The archive's index: what it holds on the left, year jumps on the right. */}
      <div className="publication-index">
        <p>{publicationItems.length} papers from {firstYear} to {lastYear}</p>
        <nav aria-label="Jump to a year">
          {publicationYears.map((year) => (
            <a key={year} href={`#publication-year-${year}`}>{year}</a>
          ))}
        </nav>
      </div>

      <div className="publication-year-list">
        {publicationYears.map((year) => {
          const yearPublications = publicationItems.filter((publication) => publication.year === year)

          return (
            <section
              className="publication-year-group"
              id={`publication-year-${year}`}
              aria-labelledby={`publication-year-${year}-title`}
              key={year}
            >
              {/* The year rides alongside its records while they scroll past. */}
              <div className="publication-year-marker">
                <h2 id={`publication-year-${year}-title`}>{year}</h2>
                <span>{yearPublications.length} {yearPublications.length === 1 ? 'paper' : 'papers'}</span>
              </div>
              <div>
                {yearPublications.map((publication) => (
                  <PublicationRecord publication={publication} key={publication.id} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}

export default PublicationsPage
