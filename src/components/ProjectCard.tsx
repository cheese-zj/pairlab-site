import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ResearchProject } from '../researchProjects'

/* One showcase tile, shared by the research grid and the homepage's recent
   work row so both surfaces open the same preview with the same morph. */
type ProjectCardProps = {
  project: ResearchProject
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
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
