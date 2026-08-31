import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import MosaicFlow from '../components/MosaicFlow'
import PublicationRecord from '../components/PublicationRecord'
import { usePublications } from '../usePublications'

const LATEST_COUNT = 4

function HomePage() {
  const latestPublications = usePublications().slice(0, LATEST_COUNT)

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="home-photo" role="img" aria-label="The University of Sydney Quadrangle">
          <img src="/usyd-quadrangle.webp" alt="" aria-hidden="true" fetchPriority="high" />
        </div>
        <div className="home-panel">
          <MosaicFlow />
          <div className="home-copy">
            <h1 className="hero-wordmark" id="home-heading">
              <img src="/hero-wordmark.webp" alt="" aria-hidden="true" />
              <span className="sr-only">PAIR Lab — Physical AI and Robot Learning Research in Australia</span>
            </h1>
            <h2>Physical AI &amp; Robotics</h2>
            <p className="home-summary">Robots that perceive, learn and move in the real world.</p>
            <Link to="/research">Explore research <ArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="home-intro plot-ground" aria-labelledby="home-intro-title">
        <div className="home-intro-heading">
          <span>University of Sydney · Australia</span>
          <h2 id="home-intro-title">Robot learning for useful, reliable physical intelligence.</h2>
        </div>
        <div className="home-intro-copy">
          <p>PAIR Lab is a robotics research group at the University of Sydney. We study how robots can perceive, learn and act in unstructured environments, with a focus on manipulation that works beyond controlled laboratory demonstrations.</p>
          <p>Our research connects imitation learning, dexterous manipulation, multi-robot collaboration and intervention-aware autonomy. We build and test physical systems to understand how learned robot behaviour can become more adaptable, capable and reliable.</p>
          <Link to="/people">Meet the researchers <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* The band spans the sheet and carries the rails; the card grid sits
          one lining inside them like the rest of the printed content. */}
      <section className="home-themes-band" aria-label="PAIR Lab research themes">
        <div className="home-themes">
          <article data-accent="learning">
            <span>01</span>
            <h3><mark>Robot learning</mark></h3>
            <p>Visuomotor and imitation-learning methods grounded in real robot experience.</p>
          </article>
          <article data-accent="dexterous">
            <span>02</span>
            <h3><mark>Physical intelligence</mark></h3>
            <p>Systems that connect perception, action and contact in complex physical tasks.</p>
          </article>
          <article data-accent="reliable">
            <span>03</span>
            <h3><mark>Reliable manipulation</mark></h3>
            <p>Monitoring, intervention and constraints for long-horizon robot behaviour.</p>
          </article>
        </div>
      </section>

      <section className="home-latest" aria-labelledby="home-latest-title">
        <div className="home-latest-inner">
          <header>
            <div>
              <span>Latest</span>
              <h2 id="home-latest-title">Recent publications</h2>
            </div>
            <Link to="/research#publications">All publications <ArrowRight size={18} /></Link>
          </header>
          <div className="home-latest-list">
            {latestPublications.map((publication) => (
              <PublicationRecord publication={publication} key={publication.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
