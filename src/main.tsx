import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/unbounded'
import '@fontsource-variable/space-grotesk'
import './styles.css'
import './dark.css'
import './ascii.css'
import './pixel-theme.css'
import App from './App'

// Local-only logo exploration lab. `import.meta.env.DEV` is false in
// production builds, so this route and its module are never shipped.
const LogoLab =
  import.meta.env.DEV && window.location.pathname.replace(/\/$/, '') === '/logo'
    ? lazy(() => import('./LogoLab'))
    : null

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {LogoLab ? (
      <Suspense fallback={null}>
        <LogoLab />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
