import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { installGlobalErrorCapture } from './utils/errors'

// Install global error capture before the React tree mounts
// so that any runtime error or unhandled rejection is saved to localStorage.
installGlobalErrorCapture();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
