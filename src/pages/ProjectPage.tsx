import type { CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { researchProjects } from '../researchProjects'
import NotFoundPage from './NotFoundPage'

function ProjectPage() {
  const { slug } = useParams()
  const projectIndex = researchProjects.findIndex((item) => item.slug === slug)
  const project = researchProjects[projectIndex]

  if (!project) return <NotFoundPage />

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
        <div>
          <h1>{project.title}</h1>
          {project.subtitle ? <p>{project.subtitle}</p> : null}
        </div>
      </section>

      <section className="project-body">
        <div className="project-body-intro">
          <p className="project-lede">{project.summary}</p>
          <div className="project-topics" aria-label="Research topics">
            {project.topics.map((topic) => <span key={topic}>{topic}</span>)}
          </div>
        </div>
        <div className="project-body-copy">
          <p>{project.description}</p>
          {project.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {project.externalUrl ? (
            <a className="project-external" href={project.externalUrl} target="_blank" rel="noreferrer">
              {project.externalLabel ?? 'View research output'} <ArrowUpRight size={19} />
            </a>
          ) : null}
        </div>
      </section>

      {project.videos ? (
        <section className="project-demos" aria-labelledby="project-demos-title">
          <header>
            <span>Physical demonstrations</span>
            <h2 id="project-demos-title">Watch the robots work.</h2>
          </header>
          <div className="project-demo-grid">
            {project.videos.map((video, index) => (
              <article className="project-demo-card" key={video.src}>
                <video controls playsInline preload="none" src={video.src} poster={video.poster} aria-label={video.title} />
                <div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{video.title}</h3>
                  {video.caption ? <p>{video.caption}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="project-navigation" aria-label="Project navigation">
        <Link className="project-next" to={`/research/${nextProject.slug}`}>{nextContent}</Link>
      </nav>
    </main>
  )
}

export default ProjectPage
