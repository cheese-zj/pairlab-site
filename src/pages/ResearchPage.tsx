import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { publications, williamPublicationListUrl, williamScholarUrl } from '../publications'
import { researchProjects } from '../researchProjects'
import type { ResearchProject } from '../researchProjects'

const publicationYears = [...new Set(publications.map((publication) => publication.year))]

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
          <strong>{project.title}</strong>
          {project.subtitle ? <span>{project.subtitle}</span> : null}
        </span>
        <span className="project-card-action" aria-hidden="true">
          <ArrowUpRight size={24} />
        </span>
      </span>
    </>
  )

  return (
    <Link className={className} to={`/research/${project.slug}`} style={style}>
      {content}
    </Link>
  )
}

function ResearchPage() {
  return (
    <main className="route-page research-page">
      <header className="page-title research-title">
        <h1>Research</h1>
        <span className="research-tab" aria-label="Research page contents">Projects + publications</span>
      </header>

      <section className="research-intro" aria-labelledby="research-intro-title">
        <p>Based at the University of Sydney, PAIR Lab develops robot-learning methods for physical systems that must perceive, coordinate and adapt in the real world.</p>
        <div>
          <h2 id="research-intro-title">From learned policies to capable physical behaviour.</h2>
          <p>Our work spans imitation learning, dexterous and multi-arm manipulation, collaborative robotics, policy monitoring and constraint-aware motion. Each project is tested through physical demonstrations and practical tasks.</p>
        </div>
      </section>

      <section className="research-project-grid" aria-label="Research projects">
        {researchProjects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.slug} />
        ))}
      </section>

      <section className="research-areas" aria-labelledby="research-areas-title">
        <header>
          <span>Research focus</span>
          <h2 id="research-areas-title">How we approach physical intelligence</h2>
        </header>
        <div>
          <article>
            <span>01</span>
            <h3>Learning from demonstration</h3>
            <p>Visuomotor and action-chunking policies for robots learning coordinated behaviour from physical examples.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Dexterous manipulation</h3>
            <p>Hands, tools and multiple robotic arms working through contact-rich, long-horizon tasks.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Reliable autonomy</h3>
            <p>Monitoring, calibrated intervention and constraint-aware adaptation for learned robot policies.</p>
          </article>
        </div>
      </section>

      <section className="research-publications" id="publications" aria-labelledby="publications-title">
        <header className="publication-section-title">
          <div>
            <span>Research record</span>
            <p>Papers, project sites and physical demonstrations from PAIR Lab, together with the selected peer-reviewed publication record of lab lead William Zhi.</p>
          </div>
          <h2 id="publications-title">Publications</h2>
        </header>

        <section className="publication-lab-outputs" aria-labelledby="lab-outputs-title">
          <header>
            <span>PAIR Lab</span>
            <div>
              <h3 id="lab-outputs-title">Current lab outputs</h3>
              <p>The papers and active research outputs already represented across this site.</p>
            </div>
          </header>
          <div className="lab-output-list">
            {researchProjects.map((project) => (
              <article className="lab-output-item" key={project.slug}>
                <span>{project.id}</span>
                <div>
                  <small>{project.type}</small>
                  <h4>{project.title}</h4>
                  {project.subtitle ? <p>{project.subtitle}</p> : null}
                </div>
                <div className="lab-output-actions">
                  <Link to={`/research/${project.slug}`}>Project overview <ArrowUpRight size={16} /></Link>
                  {project.externalUrl ? (
                    <a href={project.externalUrl} target="_blank" rel="noreferrer">
                      {project.externalLabel ?? 'Research output'} <ArrowUpRight size={16} />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="publication-academic-archive" aria-labelledby="academic-publications-title">
          <header>
            <div>
              <span>William Zhi · Lab lead</span>
              <p>Selected peer-reviewed conference and journal publications in robotics and machine learning.</p>
            </div>
            <div>
              <h3 id="academic-publications-title">Academic archive</h3>
              <div className="publication-source-links">
                <a href={williamScholarUrl} target="_blank" rel="noreferrer">Google Scholar <ArrowUpRight size={17} /></a>
                <a href={williamPublicationListUrl} target="_blank" rel="noreferrer">Original list <ArrowUpRight size={17} /></a>
              </div>
            </div>
          </header>

          <div className="publication-year-list">
            {publicationYears.map((year) => {
              const yearPublications = publications.filter((publication) => publication.year === year)

              return (
                <section className="publication-year-group" aria-labelledby={`publication-year-${year}`} key={year}>
                  <div className="publication-year-marker">
                    <h4 id={`publication-year-${year}`}>{year}</h4>
                    <span>{yearPublications.length} {yearPublications.length === 1 ? 'paper' : 'papers'}</span>
                  </div>
                  <div>
                    {yearPublications.map((publication) => (
                      <article className="publication-record" key={publication.id}>
                        <span className="publication-record-id">{publication.id}</span>
                        <div>
                          <span className="publication-venue">{publication.venue}</span>
                          <h5>{publication.title}</h5>
                          <p>{publication.authors}</p>
                        </div>
                        {publication.url ? (
                          <a href={publication.url} target="_blank" rel="noreferrer" aria-label={`Read ${publication.title}`}>
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
      </section>
    </main>
  )
}

export default ResearchPage
