import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link to="/">PAIR Lab</Link>
      <p>School of Computer Science · The University of Sydney</p>
      <div>
        <a href="https://simontruffer.ch/mt-shift/" target="_blank" rel="noreferrer">MT Shift — Simon Truffer</a>
        <a href="https://www.weimingzhi.com/publication-list" target="_blank" rel="noreferrer">Publications</a>
        <a href="mailto:pairlab212@gmail.com">Email</a>
      </div>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  )
}

export default SiteFooter
