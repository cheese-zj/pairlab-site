import { useEffect } from 'react'

function JoinPage() {
  useEffect(() => { document.title = 'Join — PAIR Lab' }, [])

  return (
    <main className="route-page join-page">
      <section className="join-heading">
        <p>03 / Join</p>
        <h1>Work with us.</h1>
        <p>We welcome enquiries from prospective researchers and collaborators.</p>
      </section>
      <div className="join-types">
        <span>PhD &amp; student research</span>
        <span>Academic collaboration</span>
        <span>Industry partnerships</span>
      </div>
    </main>
  )
}

export default JoinPage
