import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { canonicalUrl, getSeoData, prerenderPaths, sitemapPaths, siteUrl } from './seo'

export function render(pathname: string) {
  return renderToString(
    <StaticRouter location={pathname}>
      <App />
    </StaticRouter>,
  )
}

export { canonicalUrl, getSeoData, prerenderPaths, sitemapPaths, siteUrl }
