import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import AppFooter from './assets/Footer.jsx'
import AppHeader from './assets/Header.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppHeader />
    <App />
    <AppFooter />
  </StrictMode>,
)
