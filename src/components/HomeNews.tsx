import { ArrowUpRight } from 'lucide-react'
import { formatNewsDate, newsItems } from '../news'
import type { NewsItem } from '../news'

/* The homepage bulletin. It reads like the publications ledger on the research
   page — stamped kicker, telemetry dates, hairline records — so News belongs to
   the same printed sheet as the rest of the site rather than sitting on it. */
function HomeNews({ items = newsItems }: { items?: readonly NewsItem[] }) {
  const sortedItems = [...items].sort((left, right) => right.date.localeCompare(left.date))
  const count = sortedItems.length

  return (
    <section className={`home-news${count > 0 ? '' : ' is-empty'}`} id="news" aria-labelledby="home-news-title">
      <div className="home-news-inner">
        <header className="home-news-header">
          <span className="home-kicker">Lab bulletin</span>
          <h2 id="home-news-title">News</h2>
          <p>Research, people and life at PAIR Lab.</p>
        </header>
        {count > 0 ? (
          <ol className="home-news-list" role="list">
            {sortedItems.map((item) => (
              <li key={item.id}>
                <article className={`home-news-item${item.href ? ' is-linked' : ''}`}>
                  <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                  <div className="home-news-copy">
                    <h3>
                      {item.href ? (
                        // Full navigation also supports Worker-proxied project URLs.
                        <a href={item.href}>{item.title}</a>
                      ) : item.title}
                    </h3>
                    {item.summary ? <p>{item.summary}</p> : null}
                  </div>
                  {item.href ? (
                    <span className="home-news-go" aria-hidden="true"><ArrowUpRight size={18} /></span>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <div className="home-news-empty">
            <p>
              No announcements yet. In the meantime, <a href="/research">explore our research</a> or{' '}
              <a href="/people">meet the team</a>.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeNews
