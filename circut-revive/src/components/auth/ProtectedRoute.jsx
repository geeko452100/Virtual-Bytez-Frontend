import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (!isConfigured) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="panel w-full max-w-[420px] p-8 text-left">
          <h1>Supabase required</h1>
          <p>Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file to enable accounts and checkout.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <p className="py-8 text-text-muted">Loading…</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/account" replace />
  }

  return children
}
