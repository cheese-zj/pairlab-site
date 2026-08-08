import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
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
        <span className="research-tab" aria-label="Current research view">Projects</span>
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
    </main>
  )
}

export default ResearchPage
