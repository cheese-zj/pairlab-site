import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import MosaicFlow from '../components/MosaicFlow'

function HomePage() {
  useEffect(() => { document.title = 'PAIR Lab — University of Sydney' }, [])

  return (
    <main className="home-page">
      <div className="home-photo">
        <img src="/usyd-quadrangle.jpg" alt="The University of Sydney Quadrangle" />
      </div>
      <section className="home-panel">
        <MosaicFlow />
        <div className="home-copy">
          <h1 className="hero-wordmark">
            <video autoPlay muted playsInline preload="auto" poster="/hero-wordmark-poster.png" aria-hidden="true">
              <source src="/hero-wordmark.webm" type="video/webm" />
            </video>
            <span className="sr-only">PAIR Lab</span>
          </h1>
          <h2>Physical AI &amp; Robotics</h2>
          <p className="home-summary">Robots that perceive, learn and move in the real world.</p>
          <Link to="/research">Explore research <ArrowRight /></Link>
          <span>Led by Dr Weiming (William) Zhi</span>
        </div>
      </section>
    </main>
  )
}

export default HomePage
