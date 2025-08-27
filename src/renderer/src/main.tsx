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
    environment: import.meta.env.VITE_REACT_APP_ENV_VALUE,
    beforeSend(event) {
      // Add additional context for renderer process errors
      if (event.tags) {
        event.tags.process = 'renderer'
      } else {
        event.tags = { process: 'renderer' }
      }
      return event
    }
  })

  // Global error handlers for renderer process
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    Sentry.captureException(event.error || new Error(event.message), {
      tags: { errorType: 'globalError', process: 'renderer' },
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    Sentry.captureException(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        tags: { errorType: 'unhandledRejection', process: 'renderer' }
      }
    )
  })
})()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
