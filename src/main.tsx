import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/unbounded'
import '@fontsource-variable/space-grotesk'
import './styles.css'
import './dark.css'
import './ascii.css'
import './pixel-theme.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
