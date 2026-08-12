import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import Seo from './components/Seo'
import HomePage from './pages/HomePage'
import JoinPage from './pages/JoinPage'
import PeoplePage from './pages/PeoplePage'
import ProjectPage from './pages/ProjectPage'
import ResearchPage from './pages/ResearchPage'
import NotFoundPage from './pages/NotFoundPage'

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
      <Seo />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/research/preview/:slug" element={<ProjectPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/publications" element={<Navigate to="/research" replace />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </>
  )
}

export default App
