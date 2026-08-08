import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { researchProjects } from '../researchProjects'

function PublicationsPage() {
  return (
    <main className="route-page publications-page">
      <header className="page-title publications-title">
        <p>Research record</p>
        <h1>Publications<br />&amp; outputs</h1>
        <p>Papers, project sites and physical demonstrations from PAIR Lab research in robot learning, manipulation and physical intelligence.</p>
      </header>

      <section className="publication-list" aria-label="Selected research outputs">
        {researchProjects.map((project) => (
          <article className="publication-item" key={project.slug}>
            <span>{project.id}</span>
            <div>
              <span>{project.type}</span>
              <h2>{project.title}</h2>
              {project.subtitle ? <p>{project.subtitle}</p> : null}
              <ul aria-label={`${project.title} topics`}>
                {project.topics.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
            </div>
            <div className="publication-actions">
              <Link to={`/research/${project.slug}`}>PAIR Lab overview <ArrowRight size={17} /></Link>
              {project.externalUrl ? (
                <a href={project.externalUrl} target="_blank" rel="noreferrer">{project.externalLabel ?? 'Research output'} <ArrowUpRight size={17} /></a>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <aside className="publication-archive">
        <div>
          <span>Complete academic record</span>
          <h2>More papers from the lab lead.</h2>
        </div>
        <a href="https://scholar.google.com/citations?hl=en&user=Y6MWNsQAAAAJ&view_op=list_works&sortby=pubdate" target="_blank" rel="noreferrer">
          William Zhi on Google Scholar <ArrowUpRight size={20} />
        </a>
      </aside>
    </main>
  )
}

export default PublicationsPage
