import { ArrowUpRight, Mail } from 'lucide-react'

function JoinPage() {
  return (
    <main className="route-page join-page plot-ground">
      <section className="join-heading">
        <p>03 / Join</p>
        <h1>Work with us.</h1>
        <p>We welcome enquiries from prospective researchers and collaborators.</p>
        <a className="join-contact" href="mailto:weiming.zhi@sydney.edu.au">
          <span><Mail size={18} /> Email William</span>
          <strong>weiming.zhi@sydney.edu.au</strong>
          <ArrowUpRight size={20} />
        </a>
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
