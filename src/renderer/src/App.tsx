import Providers from './components/providers/providers'
import SentryErrorBoundary from './components/providers/SentryErrorBoundary'

function App(): JSX.Element {
  return (
    <SentryErrorBoundary>
      <Providers />
    </SentryErrorBoundary>
  )
}

export default App
