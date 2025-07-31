// src/renderer/src/components/providers/SentryErrorBoundary.tsx
import * as Sentry from '@sentry/electron/renderer'
import React, { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class SentryErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.captureException(error, { extra: { errorInfo } })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <div>Something went wrong. Our team has been notified.</div>
    }

    return this.props.children
  }
}

export default SentryErrorBoundary
