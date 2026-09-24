import { Link, useLocation } from 'react-router-dom'
import MosaicBand from './MosaicBand'

function SiteFooter() {
  const isHome = useLocation().pathname === '/'

  return (
    <footer className="site-footer">
      {!isHome && <MosaicBand />}
      <div className="site-footer-inner">
        <Link to="/">PAIR Lab</Link>
        <p>School of Computer Science · The University of Sydney</p>
        <div className="site-footer-links">
          <a href="mailto:pairlab212@gmail.com">Email</a>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}

export default SiteFooter
