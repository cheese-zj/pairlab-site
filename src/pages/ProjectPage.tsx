import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { researchProjects } from '../researchProjects'

function ProjectPage() {
  const { slug } = useParams()
  const projectIndex = researchProjects.findIndex((item) => item.slug === slug)
  const project = researchProjects[projectIndex]

  useEffect(() => {
    if (project) document.title = `${project.title} — PAIR Lab`
  }, [project])

  if (!project) return <Navigate to="/research" replace />

  const nextProject = researchProjects[(projectIndex + 1) % researchProjects.length]
  const nextContent = (
    <>
      <span>Next project</span>
      <strong>{nextProject.title}</strong>
      <ArrowRight size={22} />
    </>
  )

  return (
    <main className="route-page project-page">
      <section className="project-hero" style={{ '--project-image': `url(${project.image})` } as CSSProperties}>
        <span className="project-hero-image" aria-hidden="true" />
        <div className="project-hero-topline">
          <Link to="/research"><ArrowLeft size={16} /> All projects</Link>
          <span>{project.id} / {project.type}</span>
        </div>
        <h1>{project.title}</h1>
      </section>

      <section className="project-body">
        <p className="project-lede">{project.summary}</p>
        <p>{project.description}</p>
        {nextProject.externalUrl ? (
          <a className="project-next" href={nextProject.externalUrl}>{nextContent}</a>
        ) : (
          <Link className="project-next" to={`/research/${nextProject.slug}`}>{nextContent}</Link>
        )}
      </section>
    </main>
  )
}

export default ProjectPage
