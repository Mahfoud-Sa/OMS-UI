// src/renderer/src/components/providers/SentryErrorBoundary.tsx
import * as Sentry from '@sentry/electron/renderer'
import React, { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class SentryErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('React Error Boundary caught an error:', error, errorInfo)
    
    // Capture the error with Sentry with additional context
    Sentry.captureException(error, {
      tags: { 
        errorType: 'reactErrorBoundary', 
        process: 'renderer' 
      },
      extra: { 
        errorInfo,
        componentStack: errorInfo.componentStack,
        errorBoundary: 'SentryErrorBoundary'
      },
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    })

    this.setState({ error, errorInfo })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          color: '#333'
        }}>
          <h2>Something went wrong</h2>
          <p>Our team has been notified and we're working to fix this issue.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Reload Application
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Error Details (Development Only)</summary>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                overflow: 'auto',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default SentryErrorBoundary
