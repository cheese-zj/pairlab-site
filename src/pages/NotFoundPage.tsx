import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="route-page not-found-page">
      <span>404 / Page not found</span>
      <h1>This robot took a wrong turn.</h1>
      <p>The page you requested does not exist. Return to PAIR Lab or explore our robotics research.</p>
      <div>
        <Link to="/"><ArrowLeft size={18} /> Back to PAIR Lab</Link>
        <Link to="/research">Explore research</Link>
      </div>
    </main>
  )
}

export default NotFoundPage
