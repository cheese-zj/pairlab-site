import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import MosaicFlow from '../components/MosaicFlow'

function HomePage() {
  useEffect(() => { document.title = 'PAIR Lab — University of Sydney' }, [])

  return (
    <main className="home-page">
      <div className="home-photo" role="img" aria-label="Robotics systems in the PAIR Lab at the University of Sydney">
        <img className="home-photo-humanoid" src="/pairlab-humanoid.webp" alt="" aria-hidden="true" />
        <img className="home-photo-dual-arm" src="/pairlab-dual-arm.webp" alt="" aria-hidden="true" />
        <img className="home-photo-demo" src="/pairlab-demo.webp" alt="" aria-hidden="true" />
        <img className="home-photo-quadrangle" src="/usyd-quadrangle.webp" alt="" aria-hidden="true" />
      </div>
      <section className="home-panel">
        <MosaicFlow />
        <div className="home-copy">
          <h1 className="hero-wordmark">
            <img src="/hero-wordmark.webp" alt="" aria-hidden="true" />
            <span className="sr-only">PAIR Lab</span>
          </h1>
          <h2>Physical AI &amp; Robotics</h2>
          <p className="home-summary">Robots that perceive, learn and move in the real world.</p>
          <Link to="/research">Explore research <ArrowRight /></Link>
        </div>
      </section>
    </main>
  )
}

export default HomePage
