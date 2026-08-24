import type { CSSProperties } from 'react'
import { ArrowRight, Globe, GraduationCap, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import MosaicBand from '../components/MosaicBand'
import { labLead, peopleSections } from '../people'
import type { Person, PersonLink } from '../people'

/* lucide dropped its brand icons; this is the original lucide/feather linkedin path. */
function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function LinkIcon({ kind }: Pick<PersonLink, 'kind'>) {
  if (kind === 'linkedin') return <LinkedInIcon size={15} />
  if (kind === 'scholar') return <GraduationCap size={16} />
  if (kind === 'email') return <Mail size={15} />
  return <Globe size={15} />
}

function PersonCard({ person, ordinal, showRole = false }: { person: Person, ordinal: string, showRole?: boolean }) {
  return (
    <article className="people-card">
      <div
        className="people-card-photo"
        style={{ '--person-image': `url(${person.image})` } as CSSProperties}
        role="img"
        aria-label={`${person.name} portrait`}
      />
      <div className="people-card-head">
        <span aria-hidden="true">{ordinal}</span>
        <h3>{person.name}</h3>
      </div>
      {showRole ? <p>{person.role}</p> : null}
      {person.links.length > 0 ? (
        <div className="people-card-links">
          {person.links.map((link) => {
            const external = link.href.startsWith('http')
            return (
              <a
                key={link.href}
                href={link.href}
                aria-label={`${person.name} — ${link.label}`}
                title={link.label}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                <LinkIcon kind={link.kind} />
              </a>
            )
          })}
        </div>
      ) : null}
    </article>
  )
}

/* One marker wash per level, so the roster's hierarchy reads in colour. */
const sectionWash: Record<string, string> = {
  phd: 'hl-coral',
  mphil: 'hl-blue',
  honours: 'hl-green',
  undergrad: 'hl-plum',
}

function PeoplePage() {
  const totalPeople = 1 + peopleSections.reduce((count, section) => count + section.people.length, 0)

  return (
    <main className="route-page people-page">
      <header className="page-title people-title">
        <p>{totalPeople} researchers · faculty &amp; students · Sydney, Australia</p>
        <h1>People</h1>
        <p className="people-title-note">The people building adaptable, intelligent robots at Sydney.</p>
      </header>

      <MosaicBand ground="light" />

      <section className="people-section" aria-labelledby="people-section-faculty">
        <header>
          <h2 id="people-section-faculty"><mark className="hl-yellow">Faculty</mark></h2>
          <span>01</span>
        </header>
        <div className="people-grid">
          <PersonCard person={labLead} ordinal="01" showRole />
        </div>
      </section>

      {peopleSections.map((section) => (
        <section className="people-section" key={section.id} aria-labelledby={`people-section-${section.id}`}>
          <header>
            <h2 id={`people-section-${section.id}`}>
              <mark className={sectionWash[section.id] ?? 'hl-yellow'}>{section.title}</mark>
            </h2>
            <span>{String(section.people.length).padStart(2, '0')}</span>
          </header>
          <div className="people-grid">
            {section.people.map((person, index) => (
              <PersonCard person={person} ordinal={String(index + 1).padStart(2, '0')} key={person.slug} />
            ))}
          </div>
        </section>
      ))}

      <aside className="people-join">
        <Link to="/join">
          <span>Prospective students &amp; collaborators</span>
          <strong>View opportunities <ArrowRight size={18} /></strong>
        </Link>
      </aside>
    </main>
  )
}

export default PeoplePage
