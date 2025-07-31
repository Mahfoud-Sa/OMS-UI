import * as Sentry from '@sentry/electron/renderer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/index.css'
;(async () => {
  const appVersion = window.electron.ipcRenderer.sendSync('get-app-version')
  Sentry.init({
    dsn: 'https://8b0ea8534fe0026e32065cc94267aeb0@o4509627286618112.ingest.de.sentry.io/4509627337211984',
    // Use the same release identifier as in the main process
    release: appVersion,
    // Additional recommended options for React apps:
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
        maskAllInputs: false
      })
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    sendDefaultPii: true,
    environment: import.meta.env.VITE_REACT_APP_ENV_VALUE
  })
})()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
