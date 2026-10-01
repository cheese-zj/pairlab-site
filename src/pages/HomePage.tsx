import { useState, useSyncExternalStore } from 'react'
import HomeFilm from '../components/HomeFilm'
import HomeNews from '../components/HomeNews'
import HomeRecentWork from '../components/HomeRecentWork'
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

// Save-Data visitors keep the poster rather than streaming a background reel.
type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } }
const subscribeToSaveData = () => () => {}
const prefersSavingData = () => Boolean((navigator as SaveDataNavigator).connection?.saveData)
const serverSaveData = () => true

function HomePage() {
  const reducedMotion = useSyncExternalStore(subscribeToMotion, prefersReducedMotion, serverReducedMotion)
  const saveData = useSyncExternalStore(subscribeToSaveData, prefersSavingData, serverSaveData)
  const [paused, setPaused] = useState(false)
  const motionAllowed = !reducedMotion && !saveData
  const motionEnabled = motionAllowed && !paused

  return (
    <main className="home-page">
      {/* The intro scrolls away while the film frame below opens out to full
          bleed; the hero declares the intro's timeline so the frame can use it. */}
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="home-intro">
          <div className="home-copy">
            <h1 className="hero-wordmark" id="home-heading">
              <img
                src={motionEnabled ? '/hero-wordmark.webp' : '/hero-wordmark-still.webp'}
                width="1440"
                height="218"
                alt=""
                aria-hidden="true"
                fetchPriority="high"
              />
              <span className="sr-only">PAIR Lab — Physical AI and Robot Learning Research in Australia</span>
            </h1>
            <h2>Physical AI &amp; Robotics</h2>
            <p className="home-summary">We study how robots perceive, learn and act in the real world. A robotics research group at the University of Sydney.</p>
          </div>
        </div>
        <HomeFilm motionEnabled={motionEnabled} onToggleMotion={motionAllowed ? () => setPaused(!paused) : undefined} />
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
