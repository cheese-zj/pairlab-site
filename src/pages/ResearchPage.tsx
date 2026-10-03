import { useEffect, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { ArrowRight } from 'lucide-react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { researchProjects, researchThemes, sortProjects } from '../researchProjects'
import type { ProjectOrder } from '../researchProjects'

const orderOptions: Array<{ value: ProjectOrder, label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'theme', label: 'By theme' },
  { value: 'title', label: 'A–Z' },
]
const isOrder = (value: string | null): value is ProjectOrder => orderOptions.some((option) => option.value === value)

/* The page is prerendered newest-first, so the URL's choice only applies once
   the browser has hydrated that markup. */
const subscribeNever = () => () => {}
const onClient = () => true
const onServer = () => false

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> }
}

/* Rows fill evenly whatever a theme holds: one project spans the sheet, pairs
   and fours sit two across, threes and everything else three across. */
function columnsFor(count: number) {
  if (count === 1) return 1
  if (count % 3 === 0) return 3
  if (count % 2 === 0) return 2
  return 3
}

function ProjectGrid({ projects, columns }: { projects: ReturnType<typeof sortProjects>, columns: number }) {
  return (
    <div className="research-project-grid" data-columns={columns}>
      {projects.map((project) => (
        <ProjectCard project={project} key={project.slug} />
      ))}
    </div>
  )
}

function ResearchPage() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const hydrated = useSyncExternalStore(subscribeNever, onClient, onServer)
  const requested = searchParams.get('order')
  const order: ProjectOrder = hydrated && isOrder(requested) ? requested : 'newest'

  /* Publications used to live further down this page. Fragments never reach
     the Worker, so old /research#publications links are forwarded here. */
  useEffect(() => {
    if (hash === '#publications') navigate('/publications', { replace: true })
    else if (hash.startsWith('#publication-year-')) navigate(`/publications${hash}`, { replace: true })
  }, [hash, navigate])

  /* The choice lives in the URL, so a link can share it. Where the browser
     can, the plates glide to their new places rather than jumping. */
  const changeOrder = (next: ProjectOrder) => {
    const apply = () => setSearchParams(next === 'newest' ? {} : { order: next }, { replace: true, preventScrollReset: true })
    const transitionDocument = document as ViewTransitionDocument
    if (!transitionDocument.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply()
      return
    }
    const root = document.documentElement
    root.classList.add('is-reordering')
    transitionDocument.startViewTransition(() => flushSync(apply)).finished
      .finally(() => root.classList.remove('is-reordering'))
  }

  let catalogue: ReactNode
  if (order === 'theme') {
    catalogue = researchThemes.map((theme) => {
      const projects = sortProjects(researchProjects.filter((project) => project.theme === theme.id), 'newest')
      if (projects.length === 0) return null

      return (
        <section className="research-theme" data-accent={theme.id} aria-labelledby={`theme-${theme.id}`} key={theme.id}>
          <header className="research-theme-header">
            <h2 id={`theme-${theme.id}`}><mark>{theme.title}</mark></h2>
            <p>{theme.summary}</p>
          </header>
          <ProjectGrid projects={projects} columns={columnsFor(projects.length)} />
        </section>
      )
    })
  } else {
    catalogue = (
      <section className="research-catalogue" aria-label="Research projects">
        <ProjectGrid projects={sortProjects(researchProjects, order)} columns={3} />
      </section>
    )
  }

  return (
    <main className="route-page research-page">
      <header className="research-intro">
        <h1>From learned policies to <strong>capable physical behaviour</strong>.</h1>
        <p>
          PAIR Lab develops robot-learning methods for physical systems that must perceive, coordinate and adapt in the real world. Our work spans <mark className="hl-yellow">imitation learning</mark>, <mark className="hl-coral">dexterous and multi-arm manipulation</mark>, <mark className="hl-blue">collaborative robotics</mark>, <mark className="hl-green">policy monitoring</mark> and <mark className="hl-plum">constraint-aware motion</mark>.
        </p>
      </header>

      <div className="research-toolbar">
        <div className="research-order" role="radiogroup" aria-labelledby="research-order-label">
          <span id="research-order-label">Order</span>
          {orderOptions.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="research-order"
                value={option.value}
                checked={order === option.value}
                onChange={() => changeOrder(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {/* Outside the theme view, the plates' top edges carry the theme;
            this says which colour is which. */}
        {order === 'theme' ? null : (
          <ul className="research-legend" aria-label="Research themes">
            {researchThemes.map((theme) => (
              <li data-accent={theme.id} key={theme.id}><mark>{theme.title}</mark></li>
            ))}
          </ul>
        )}
      </div>

      {catalogue}

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
