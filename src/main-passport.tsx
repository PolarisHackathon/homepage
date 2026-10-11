import { createRoot } from 'react-dom/client'
import { PassportIntro } from './pages/PassportIntro'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ErrorPage } from './components/ErrorPage'
import { ToastProvider } from './components/Toast'
import './styles/shared.css'
import './styles/editorial.css'
import './styles/home.css'
import './styles/passport.css'
import './styles/error.css'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallback={<ErrorPage kind="error" />}>
    <ToastProvider>
      <PassportIntro />
    </ToastProvider>
  </ErrorBoundary>,
)
