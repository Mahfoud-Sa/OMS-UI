import Providers from './components/providers/providers'
import SentryErrorBoundary from './components/providers/SentryErrorBoundary'
import ErrorTestComponent from './components/ErrorTestComponent'

function App(): JSX.Element {
  return (
    <SentryErrorBoundary>
      <Providers />
      <ErrorTestComponent />
    </SentryErrorBoundary>
  )
}

export default App
