import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { people } from '../people'
import type { Person } from '../people'

type PersonModalProps = {
  person: Person
  onClose: () => void
}

function PersonModal({ person, onClose }: PersonModalProps) {
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
    <div className="person-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="person-modal" role="dialog" aria-modal="true" aria-labelledby="person-modal-title">
        <div className="person-modal-image">
          <img src={person.image} alt={person.name} />
          <span>{person.id} / People</span>
        </div>
        <div className="person-modal-content">
          <header>
            <span>{person.role}</span>
            <button type="button" onClick={onClose} aria-label="Close profile" autoFocus><X size={22} /></button>
          </header>
          <h2 id="person-modal-title">{person.name}</h2>
          <p className="person-modal-summary">{person.summary}</p>
          <div className="person-modal-biography">
            {person.biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <ul className="person-highlights" aria-label="Selected recognition">
            {person.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
          <div className="person-modal-links">
            {person.links.map((link) => (
              <a href={link.href} key={link.label} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
                {link.label} <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function PeoplePage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  useEffect(() => { document.title = 'People — PAIR Lab' }, [])

  return (
    <main className="route-page people-page">
      <header className="page-title people-title">
        <h1>People</h1>
        <span className="people-tab" aria-label="Current people view">Team</span>
      </header>

      <section className="people-card-grid" aria-label="PAIR Lab people">
        {people.map((person) => (
          <button
            className="people-person-card"
            type="button"
            key={person.slug}
            onClick={() => setSelectedPerson(person)}
            aria-haspopup="dialog"
            style={{ '--person-image': `url(${person.image})` } as CSSProperties}
          >
            <span className="people-person-photo" aria-hidden="true" />
            <span className="people-person-shade" aria-hidden="true" />
            <span className="people-person-meta"><span>{person.id}</span><span>{person.role}</span></span>
            <span className="people-person-copy">
              <strong>{person.name}</strong>
              <span aria-hidden="true"><ArrowUpRight size={23} /></span>
            </span>
          </button>
        ))}

        <Link className="people-join-card" to="/join">
          <span>Research opportunities</span>
          <h2>We are<br />growing.</h2>
          <p>Prospective students, researchers, and collaborators are welcome to get in touch.</p>
          <span className="people-join-action">Work with us <ArrowRight size={20} /></span>
        </Link>
      </section>

      {selectedPerson ? <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} /> : null}
    </main>
  )
}

export default PeoplePage
