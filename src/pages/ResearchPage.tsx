import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { researchProjects, researchThemes } from '../researchProjects'

/* Rows fill evenly whatever a theme holds: one project spans the sheet, pairs
   and fours sit two across, threes and everything else three across. */
function columnsFor(count: number) {
  if (count === 1) return 1
  if (count % 3 === 0) return 3
  if (count % 2 === 0) return 2
  return 3
}

function ResearchPage() {
  const { hash } = useLocation()
  const navigate = useNavigate()

  /* Publications used to live further down this page. Fragments never reach
     the Worker, so old /research#publications links are forwarded here. */
  useEffect(() => {
    if (hash === '#publications') navigate('/publications', { replace: true })
    else if (hash.startsWith('#publication-year-')) navigate(`/publications${hash}`, { replace: true })
  }, [hash, navigate])

  return (
    <main className="route-page research-page">
      <header className="research-intro">
        <h1>From learned policies to capable physical behaviour.</h1>
        <p>
          PAIR Lab develops robot-learning methods for physical systems that must perceive, coordinate and adapt in the real world. Our work spans imitation learning, dexterous and multi-arm manipulation, collaborative robotics, policy monitoring and constraint-aware motion.
        </p>
      </header>

      {researchThemes.map((theme) => {
        const projects = researchProjects.filter((project) => project.theme === theme.id)
        if (projects.length === 0) return null

        return (
          <section className="research-theme" data-accent={theme.id} aria-labelledby={`theme-${theme.id}`} key={theme.id}>
            <header className="research-theme-header">
              <h2 id={`theme-${theme.id}`}>{theme.title}</h2>
              <p>{theme.summary}</p>
            </header>
            <div className="research-project-grid" data-columns={columnsFor(projects.length)}>
              {projects.map((project) => (
                <ProjectCard project={project} key={project.slug} />
              ))}
            </div>
          </section>
        )
      })}

      <aside className="page-onward">
        <Link to="/publications">
          <span>Papers and venues, year by year</span>
          <strong>Publications <ArrowRight size={18} aria-hidden="true" /></strong>
        </Link>
      </aside>
    </main>
  )
}

export default ResearchPage
