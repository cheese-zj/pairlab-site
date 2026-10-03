import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProjectCard from './ProjectCard'
import { researchProjects, sortProjects } from '../researchProjects'

const RECENT_COUNT = 3

/* The newest projects, by the date each joined the catalogue, so the homepage
   always has real work to show without a separate list to maintain. */
function HomeRecentWork() {
  const recent = sortProjects(researchProjects, 'newest').slice(0, RECENT_COUNT)

  return (
    <section className="home-work" aria-labelledby="home-work-title">
      <div className="home-work-inner">
        <header className="home-work-header">
          <h2 id="home-work-title">Recent projects</h2>
          <Link className="home-work-all" to="/research">
            All {researchProjects.length} projects <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="research-project-grid home-work-grid">
          {recent.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeRecentWork
