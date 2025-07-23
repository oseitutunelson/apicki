import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './AppRoutes.jsx'
import { supabase } from './supabase'

// Clear Supabase auth session on app load to avoid using expired JWT tokens
supabase.auth.signOut().catch(() => {
  // Ignore errors if no session exists
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
)
