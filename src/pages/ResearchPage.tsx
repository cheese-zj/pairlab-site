import MosaicBand from '../components/MosaicBand'
import ProjectCard from '../components/ProjectCard'
import PublicationRecord from '../components/PublicationRecord'
import { usePublications } from '../usePublications'
import { researchProjects } from '../researchProjects'

function ResearchPage() {
  const publicationItems = usePublications()
  const publicationYears = [...new Set(publicationItems.map((publication) => publication.year))]
  const firstYear = Math.min(...publicationYears)
  const lastYear = Math.max(...publicationYears)
  const projectCount = String(researchProjects.length).padStart(2, '0')

  return (
    <main className="route-page research-page">
        {/* The claim opens the page directly — no separate title block. */}
        <section className="research-showcase" id="showcase" aria-labelledby="research-claim">
          <header className="research-intro">
            <h1 id="research-claim">From learned policies to <strong>capable physical behaviour</strong>.</h1>
            <p>
              PAIR Lab develops robot-learning methods for physical systems that must perceive, coordinate and adapt in the real world. Our work spans <mark className="hl-yellow">imitation learning</mark>, <mark className="hl-coral">dexterous and multi-arm manipulation</mark>, <mark className="hl-blue">collaborative robotics</mark>, <mark className="hl-green">policy monitoring</mark> and <mark className="hl-plum">constraint-aware motion</mark>.
            </p>
          </header>

          <div className="section-strip" aria-hidden="true">
            <span>Showcase</span>
            <span>01–{projectCount}</span>
          </div>

          <section className="research-project-grid" aria-label="Showcase projects">
            {researchProjects.map((project, index) => (
              <ProjectCard project={project} index={index} key={project.slug} />
            ))}
          </section>

          <section className="research-areas plot-ground" aria-labelledby="research-areas-title">
            <header>
              <h2 id="research-areas-title">How we approach physical intelligence</h2>
            </header>
            <div>
              <article data-accent="learning">
                <span>01</span>
                <h3><mark>Learning from demonstration</mark></h3>
                <p>Visuomotor and action-chunking policies for robots learning coordinated behaviour from physical examples.</p>
              </article>
              <article data-accent="dexterous">
                <span>02</span>
                <h3><mark>Dexterous manipulation</mark></h3>
                <p>Hands, tools and multiple robotic arms working through contact-rich, long-horizon tasks.</p>
              </article>
              <article data-accent="reliable">
                <span>03</span>
                <h3><mark>Reliable autonomy</mark></h3>
                <p>Monitoring, calibrated intervention and constraint-aware adaptation for learned robot policies.</p>
              </article>
            </div>
          </section>
        </section>

        <section className="research-publications" id="publications" aria-labelledby="publications-title">
          <MosaicBand />
          <header className="publication-section-title">
            <span>Archive</span>
            <h2 id="publications-title">Publications</h2>
            <div className="publication-section-meta">
              <p>{publicationItems.length} records · {firstYear}–{lastYear}</p>
              <nav aria-label="Jump to a publication year">
                {publicationYears.map((year) => (
                  <a key={year} href={`#publication-year-${year}`}>{year}</a>
                ))}
              </nav>
            </div>
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
                      <PublicationRecord publication={publication} key={publication.id} />
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
