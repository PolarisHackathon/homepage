import { createRoot } from 'react-dom/client'
import { PolarisNext } from './pages/PolarisNext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ErrorPage } from './components/ErrorPage'
import { ToastProvider } from './components/Toast'
import './styles/shared.css'
import './styles/editorial.css'
import './styles/experience.css'
import './styles/layout.css'
import './styles/adventure.css'
import './styles/film.css'
import './styles/error.css'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallback={<ErrorPage kind="error" />}>
    <ToastProvider>
      <PolarisNext />
    </ToastProvider>
  </ErrorBoundary>,
)
