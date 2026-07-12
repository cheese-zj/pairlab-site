import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight, GraduationCap, Link2, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { labLead, labMembers } from '../people'
import type { Person, PersonLink } from '../people'

function LinkIcon({ kind }: Pick<PersonLink, 'kind'>) {
  if (kind === 'linkedin') return <Link2 size={15} />
  if (kind === 'scholar') return <GraduationCap size={16} />
  if (kind === 'email') return <Mail size={15} />
  return <ArrowUpRight size={15} />
}

function PersonLinks({ person }: { person: Person }) {
  return (
    <div className="people-person-links" aria-label={`${person.name} links`}>
      {person.links.map((link) => {
        const external = link.href.startsWith('http')
        return (
          <a href={link.href} key={link.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
            <LinkIcon kind={link.kind} />
            <span>{link.label}</span>
            {external ? <ArrowUpRight className="people-link-arrow" size={14} /> : null}
          </a>
        )
      })}
    </div>
  )
}

function MemberCard({ person }: { person: Person }) {
  return (
    <article className="people-person-card">
      <div className="people-person-portrait" style={{ '--person-image': `url(${person.image})` } as CSSProperties}>
        <span className="people-person-photo" role="img" aria-label={`${person.name} portrait`} />
        <span className="people-person-index">{person.id}</span>
      </div>
      <div className="people-person-details">
        <span>{person.role}</span>
        <h3>{person.name}</h3>
        <PersonLinks person={person} />
      </div>
    </article>
  )
}

function PeoplePage() {
  useEffect(() => { document.title = 'People — PAIR Lab' }, [])

  return (
    <main className="route-page people-page">
      <header className="page-title people-title">
        <h1>People</h1>
        <p>The people building adaptable, intelligent robots at Sydney.</p>
      </header>

      <section className="people-lead" aria-labelledby="people-lead-heading">
        <div className="people-lead-photo" style={{ '--person-image': `url(${labLead.image})` } as CSSProperties}>
          <span role="img" aria-label={`${labLead.name} portrait`} />
          <small>{labLead.id} / Lab lead</small>
        </div>
        <div className="people-lead-copy">
          <span>{labLead.role}</span>
          <h2 id="people-lead-heading">{labLead.name}</h2>
          <p>{labLead.summary}</p>
          <PersonLinks person={labLead} />
        </div>
      </section>

      <section className="people-members" aria-labelledby="people-members-heading">
        <header>
          <h2 id="people-members-heading">Team</h2>
          <span>{String(labMembers.length).padStart(2, '0')} members · A–Z by surname</span>
        </header>
        <div className="people-card-grid">
          {labMembers.map((person) => <MemberCard person={person} key={person.slug} />)}

          <Link className="people-join-card" to="/join">
            <span>Research opportunities</span>
            <h2>Work<br />with us.</h2>
            <p>Prospective students, researchers, and collaborators are welcome to get in touch.</p>
            <span className="people-join-action">View opportunities <ArrowRight size={20} /></span>
          </Link>
        </div>
      </section>
    </main>
  )
}

export default PeoplePage
