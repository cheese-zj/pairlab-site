import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import HomePage from './pages/HomePage'
import JoinPage from './pages/JoinPage'
import PeoplePage from './pages/PeoplePage'
import ProjectPage from './pages/ProjectPage'
import ResearchPage from './pages/ResearchPage'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/:slug" element={<ProjectPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <SiteFooter />
    </>
  )
}

export default App
