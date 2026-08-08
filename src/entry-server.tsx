import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { getSeoData, prerenderPaths, siteUrl } from './seo'

export function render(pathname: string) {
  return renderToString(
    <StaticRouter location={pathname}>
      <App />
    </StaticRouter>,
  )
}

export { getSeoData, prerenderPaths, siteUrl }
