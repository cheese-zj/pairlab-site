import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link to="/">PAIR Lab</Link>
        <p>School of Computer Science · The University of Sydney</p>
        <div className="site-footer-links">
          <a href="https://www.weimingzhi.com/publication-list" target="_blank" rel="noreferrer">Publications</a>
          <a href="mailto:pairlab212@gmail.com">Email</a>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}

export default SiteFooter
