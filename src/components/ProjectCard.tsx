import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { ResearchProject } from '../researchProjects'

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } }

/* Read at the moment of interaction, so a visitor who changes the setting
   mid-visit is respected and the server render never has to guess. */
function demoAllowed() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return !(navigator as SaveDataNavigator).connection?.saveData
}

/* One project plate, shared by the research page and the homepage's recent
   work so both open the same preview with the same title morph. At rest the
   title sits centred on a dimmed still; hovering or focusing the plate plays
   the project's own demo loop and the title steps down out of its way. */
export default function ProjectCard({ project }: { project: ResearchProject }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const style = { '--project-image': `url(${project.image})` } as CSSProperties

  const playDemo = () => {
    const video = videoRef.current
    if (!video || !project.hoverVideo || !demoAllowed()) return
    // Nothing downloads until the first hover.
    if (!video.getAttribute('src')) video.src = project.hoverVideo
    video.play().catch(() => {})
  }

  const stopDemo = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.removeAttribute('data-playing')
    if (video.readyState > 0) video.currentTime = 0
  }

  return (
    <Link
      className={`research-project-card${project.heroTone === 'bright' ? ' is-bright' : ''}`}
      to={`/research/preview/${project.slug}`}
      style={style}
      data-accent={project.theme}
      // A tap is a navigation, not a preview: touch never starts the download.
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') playDemo() }}
      onPointerLeave={stopDemo}
      onFocus={playDemo}
      onBlur={stopDemo}
    >
      <span className="project-card-image" aria-hidden="true" />
      {project.hoverVideo ? (
        <video
          ref={videoRef}
          className="project-card-video"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          // Shown only once frames arrive, so the still never flashes to black.
          onPlaying={(event) => event.currentTarget.setAttribute('data-playing', '')}
        />
      ) : null}
      <span className="project-card-shade" aria-hidden="true" />
      <span className="project-card-copy">
        <strong data-morph="project-title">{project.title}</strong>
        {project.subtitle ? <span>{project.subtitle}</span> : null}
      </span>
    </Link>
  )
}
