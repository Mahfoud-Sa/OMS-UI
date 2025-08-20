// Test component to verify Sentry error catching
import React from 'react'

const ErrorTestComponent: React.FC = () => {
  const triggerReactError = () => {
    throw new Error('Test React component error - this should be caught by SentryErrorBoundary')
  }

  const triggerAsyncError = async () => {
    // This should be caught by the global unhandledrejection handler
    await Promise.reject(new Error('Test async/promise rejection error'))
  }

  const triggerGlobalError = () => {
    // This should be caught by the global error handler
    setTimeout(() => {
      throw new Error('Test global/window error')
    }, 100)
  }

  const triggerSentryError = () => {
    try {
      throw new Error('Test manually captured error')
    } catch (error) {
      // This demonstrates manual error capture
      const Sentry = require('@sentry/electron/renderer')
      Sentry.captureException(error, {
        tags: { errorType: 'manualTest', process: 'renderer' }
      })
      console.log('Manual error sent to Sentry')
    }
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      backgroundColor: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Error Testing (Dev Only)</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button 
          onClick={triggerReactError}
          style={{ padding: '5px', fontSize: '11px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          React Error
        </button>
        <button 
          onClick={triggerAsyncError}
          style={{ padding: '5px', fontSize: '11px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          Async Error
        </button>
        <button 
          onClick={triggerGlobalError}
          style={{ padding: '5px', fontSize: '11px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          Global Error
        </button>
        <button 
          onClick={triggerSentryError}
          style={{ padding: '5px', fontSize: '11px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          Manual Sentry
        </button>
      </div>
    </div>
  )
}

export default ErrorTestComponent