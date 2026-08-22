import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import MosaicFlow from '../components/MosaicFlow'

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="home-photo" role="img" aria-label="Robotics systems in the PAIR Lab at the University of Sydney">
          <img className="home-photo-humanoid" src="/pairlab-humanoid.webp" alt="" aria-hidden="true" fetchPriority="high" />
          <img className="home-photo-dual-arm" src="/pairlab-dual-arm.webp" alt="" aria-hidden="true" decoding="async" />
          <img className="home-photo-demo" src="/pairlab-demo.webp" alt="" aria-hidden="true" decoding="async" />
          <img className="home-photo-quadrangle" src="/usyd-quadrangle.webp" alt="" aria-hidden="true" decoding="async" />
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

      <section className="home-themes" aria-label="PAIR Lab research themes">
        <article data-accent="learning">
          <span>01</span>
          <h3>Robot learning</h3>
          <p>Visuomotor and imitation-learning methods grounded in real robot experience.</p>
        </article>
        <article data-accent="dexterous">
          <span>02</span>
          <h3>Physical intelligence</h3>
          <p>Systems that connect perception, action and contact in complex physical tasks.</p>
        </article>
        <article data-accent="reliable">
          <span>03</span>
          <h3>Reliable manipulation</h3>
          <p>Monitoring, intervention and constraints for long-horizon robot behaviour.</p>
        </article>
      </section>
    </main>
  )
}

export default HomePage
