import { useState, useSyncExternalStore } from 'react'
import HomeNews from '../components/HomeNews'
import HomeRecentWork from '../components/HomeRecentWork'
import MosaicFlow from '../components/MosaicFlow'
import { newsItems } from '../news'

const motionQuery = '(prefers-reduced-motion: reduce)'
function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const prefersReducedMotion = () => window.matchMedia(motionQuery).matches
// Start still during SSR/hydration; only opt into motion in the browser.
const serverReducedMotion = () => true

function HomePage() {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, serverReducedMotion)
  const [paused, setPaused] = useState(false)
  const motionEnabled = !reducedMotion && !paused

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="home-photo" aria-hidden="true">
          <img src="/usyd-quadrangle.webp" alt="" fetchPriority="high" />
        </div>
        <MosaicFlow paused={!motionEnabled} />
        <div className="home-stage">
          <div className="home-copy">
            <h1 className="hero-wordmark" id="home-heading">
              <img
                src={motionEnabled ? '/hero-wordmark.webp' : '/hero-wordmark-still.webp'}
                width="1440"
                height="218"
                alt=""
                aria-hidden="true"
              />
              <span className="sr-only">PAIR Lab — Physical AI and Robot Learning Research in Australia</span>
            </h1>
            <h2>Physical AI &amp; Robotics</h2>
            <p className="home-summary">We study how robots perceive, learn and act in the real world. A robotics research group at the University of Sydney.</p>
          </div>
        </div>
        {/* The hero's foot joins the sheet: a drafting cut and one telemetry row,
            which also carries the motion control as a quiet utility. */}
        <div className="home-foot">
          <span><span className="home-foot-lead">Robot learning research · </span>Sydney, Australia</span>
          {!reducedMotion && (
            <button className="home-motion-toggle" type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>
              {paused ? 'Resume animation' : 'Pause animation'}
            </button>
          )}
        </div>
      </section>
      {/* Announcements lead once there are any; until then real project work
          opens the page and the bulletin follows as a modest note. */}
      {newsItems.length > 0 ? (
        <>
          <HomeNews />
          <HomeRecentWork />
        </>
      ) : (
        <>
          <HomeRecentWork />
          <HomeNews />
        </>
      )}
    </main>
  )
}

export default HomePage
