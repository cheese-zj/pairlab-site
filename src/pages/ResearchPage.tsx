import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowUpRight, Play, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { researchProjects } from '../researchProjects'
import type { ResearchProject } from '../researchProjects'

type ProjectCardProps = {
  project: ResearchProject
  index: number
  onOpenDemo: (project: ResearchProject) => void
}

function ProjectCard({ project, index, onOpenDemo }: ProjectCardProps) {
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
          {project.videos ? <Play size={21} fill="currentColor" /> : <ArrowUpRight size={24} />}
        </span>
      </span>
    </>
  )

  if (project.externalUrl) {
    return (
      <a className={className} href={project.externalUrl} style={style}>
        {content}
      </a>
    )
  }

  if (project.videos) {
    return (
      <button className={className} type="button" style={style} onClick={() => onOpenDemo(project)} aria-haspopup="dialog">
        {content}
      </button>
    )
  }

  return (
    <Link className={className} to={`/research/${project.slug}`} style={style}>
      {content}
    </Link>
  )
}

type DemoModalProps = {
  project: ResearchProject
  onClose: () => void
}

function DemoModal({ project, onClose }: DemoModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="demo-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
        <header className="demo-modal-header">
          <div>
            <span>In progress / Demo reel</span>
            <h2 id="demo-modal-title">{project.title}</h2>
            {project.subtitle ? <p>{project.subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} aria-label="Close demo" autoFocus><X size={22} /></button>
        </header>
        <div className="demo-video-grid">
          {project.videos?.map((video, index) => (
            <article className="demo-video-card" key={video.src}>
              <video controls playsInline preload="metadata" src={video.src} poster={video.poster} aria-label={video.title} />
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{video.title}</h3>
                {video.caption ? <p>{video.caption}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function ResearchPage() {
  const [openDemo, setOpenDemo] = useState<ResearchProject | null>(null)
  useEffect(() => { document.title = 'Research — PAIR Lab' }, [])

  return (
    <main className="route-page research-page">
      <header className="page-title research-title">
        <h1>Research</h1>
        <span className="research-tab" aria-label="Current research view">Projects</span>
      </header>

      <section className="research-project-grid" aria-label="Research projects">
        {researchProjects.map((project, index) => (
          <ProjectCard project={project} index={index} onOpenDemo={setOpenDemo} key={project.slug} />
        ))}
      </section>
      {openDemo ? <DemoModal project={openDemo} onClose={() => setOpenDemo(null)} /> : null}
    </main>
  )
}

export default ResearchPage
