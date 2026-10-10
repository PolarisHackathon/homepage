import { createRoot } from 'react-dom/client';
import { About } from './pages/About';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorPage } from './components/ErrorPage';
import { ToastProvider } from './components/Toast';
import './styles/shared.css';
import './styles/editorial.css'
import './styles/experience.css'
import './styles/layout.css'
import './styles/error.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallback={<ErrorPage kind="error" />}>
    <ToastProvider>
      <About />
    </ToastProvider>
  </ErrorBoundary>
);

