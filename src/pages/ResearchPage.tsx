import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { publications } from '../publications'
import type { Publication } from '../publications'
import { researchProjects } from '../researchProjects'
import type { ResearchProject } from '../researchProjects'

type ProjectCardProps = {
  project: ResearchProject
  index: number
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const className = `research-project-card project-card-${index + 1}${project.hoverImage ? ' has-hover-media' : ''}${project.videos ? ' is-demo' : ''}`
  const style = {
    '--project-image': `url(${project.image})`,
    '--project-hover-image': project.hoverImage ? `url(${project.hoverImage})` : 'none',
  } as CSSProperties

  const content = (
    <>
      <span className="project-card-image" aria-hidden="true" />
      {project.hoverImage ? <span className="project-card-hover" aria-hidden="true" /> : null}
      <span className="project-card-shade" aria-hidden="true" />
      <span className="project-card-meta">
        <span>{project.id}</span>
        <span>{project.type}</span>
      </span>
      <span className="project-card-copy">
        <span className="project-card-title">
          <strong data-morph="project-title">{project.title}</strong>
          {project.subtitle ? <span>{project.subtitle}</span> : null}
        </span>
        <span className="project-card-action" aria-hidden="true">
          <ArrowUpRight size={24} />
        </span>
      </span>
    </>
  )

  return (
    <Link className={className} to={`/research/preview/${project.slug}`} style={style} data-accent={project.theme}>
      {content}
    </Link>
  )
}

function ResearchPage() {
  const [publicationItems, setPublicationItems] = useState<Publication[]>(publications)
  const publicationYears = [...new Set(publicationItems.map((publication) => publication.year))]

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return

    const controller = new AbortController()
    fetch('/api/publications', { signal: controller.signal })
      .then((response) => response.json() as Promise<Publication[]>)
      .then((items) => setPublicationItems(items))
      .catch(() => undefined)

    return () => controller.abort()
  }, [])

  return (
    <main className="route-page research-page">
      <header className="page-title research-title">
        <h1>Research</h1>
      </header>

        <section className="research-showcase" id="showcase" aria-labelledby="showcase-title">
          <h2 className="sr-only" id="showcase-title">Research showcase</h2>
          <section className="research-intro" aria-label="Research overview">
            <p>
              Based at the University of Sydney, PAIR Lab develops robot-learning methods for physical systems that must perceive, coordinate and adapt in the real world. <strong>From learned policies to capable physical behaviour.</strong> Our work spans imitation learning, dexterous and multi-arm manipulation, collaborative robotics, policy monitoring and constraint-aware motion. Each project is tested through physical demonstrations and practical tasks.
            </p>
          </section>

          <section className="research-project-grid" aria-label="Showcase projects">
            {researchProjects.map((project, index) => (
              <ProjectCard project={project} index={index} key={project.slug} />
            ))}
          </section>

          <section className="research-areas plot-ground" aria-labelledby="research-areas-title">
            <header>
              <span>Research focus</span>
              <h2 id="research-areas-title">How we approach physical intelligence</h2>
            </header>
            <div>
              <article data-accent="learning">
                <span>01</span>
                <h3>Learning from demonstration</h3>
                <p>Visuomotor and action-chunking policies for robots learning coordinated behaviour from physical examples.</p>
              </article>
              <article data-accent="dexterous">
                <span>02</span>
                <h3>Dexterous manipulation</h3>
                <p>Hands, tools and multiple robotic arms working through contact-rich, long-horizon tasks.</p>
              </article>
              <article data-accent="reliable">
                <span>03</span>
                <h3>Reliable autonomy</h3>
                <p>Monitoring, calibrated intervention and constraint-aware adaptation for learned robot policies.</p>
              </article>
            </div>
          </section>
        </section>

        <section className="research-publications" id="publications" aria-labelledby="publications-title">
          <header className="publication-section-title">
            <h2 id="publications-title">Publications</h2>
          </header>

          <div className="publication-year-list">
            {publicationYears.map((year) => {
              const yearPublications = publicationItems.filter((publication) => publication.year === year)

              return (
                <section className="publication-year-group" aria-labelledby={`publication-year-${year}`} key={year}>
                  <div className="publication-year-marker">
                    <h3 id={`publication-year-${year}`}>{year}</h3>
                    <span>{yearPublications.length} {yearPublications.length === 1 ? 'paper' : 'papers'}</span>
                  </div>
                  <div>
                    {yearPublications.map((publication) => (
                      <article className="publication-record" key={publication.id}>
                        <span className="publication-record-id">{publication.id}</span>
                        <div>
                          <span className="publication-venue">{publication.venue}</span>
                          <p className="publication-citation">{publication.citation}</p>
                        </div>
                        {publication.url ? (
                          <a href={publication.url} target="_blank" rel="noreferrer" aria-label={`Read ${publication.citation}`}>
                            <ArrowUpRight size={19} />
                          </a>
                        ) : <span className="publication-record-spacer" aria-hidden="true" />}
                      </article>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </section>
    </main>
  )
}

export default ResearchPage
