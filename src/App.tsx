import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomeIntro from './components/HomeIntro'
import RouteTransitions from './components/RouteTransitions'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import Seo from './components/Seo'
import HomePage from './pages/HomePage'
import JoinPage from './pages/JoinPage'
import PeoplePage from './pages/PeoplePage'
import PublicationsPage from './pages/PublicationsPage'
import ProjectPage from './pages/ProjectPage'
import ResearchPage from './pages/ResearchPage'
import NotFoundPage from './pages/NotFoundPage'

// The scroll reset has to land inside the synchronous flush of a view
// transition, otherwise the incoming snapshot is taken at the old offset.
const useRouteLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useRouteLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'instant' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function App() {
  const { pathname } = useLocation()

  return (
    <>
      {pathname === '/' ? <HomeIntro /> : null}
      <ScrollToTop />
      <RouteTransitions />
      <Seo />
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <div id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/research/preview/:slug" element={<ProjectPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <SiteFooter />
    </>
  )
}

export default App
