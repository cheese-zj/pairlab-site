import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProjectCard from './ProjectCard'
import { researchProjects } from '../researchProjects'

const RECENT_COUNT = 3

/* The newest showcase entries, taken from the end of the catalogue, so the
   homepage always has real work to show without a separate list to maintain. */
function HomeRecentWork() {
  const recent = researchProjects.slice(-RECENT_COUNT).reverse()

  return (
    <section className="home-work" aria-labelledby="home-work-title">
      <div className="home-work-inner">
        <header className="home-work-header">
          <div>
            <span className="home-kicker">Showcase</span>
            <h2 id="home-work-title">Recent projects</h2>
          </div>
          <Link className="home-work-all" to="/research">
            All {researchProjects.length} projects <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <div className="research-project-grid home-work-grid">
          {recent.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.slug} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeRecentWork
