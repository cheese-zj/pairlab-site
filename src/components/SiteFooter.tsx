import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link to="/">PAIR Lab</Link>
        <p>School of Computer Science · The University of Sydney</p>
        <div className="site-footer-links">
          <Link to="/publications">Publications</Link>
          <a href="mailto:pairlab212@gmail.com">Email</a>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}

export default SiteFooter
