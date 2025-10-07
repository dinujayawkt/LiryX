import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export function RequireAuth({ children }) {
  const { token, user } = useSelector((s) => s.auth)
  const isAuthed = !!token || !!user
  const location = useLocation()
  if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function PublicOnly({ children }) {
  const { token, user } = useSelector((s) => s.auth)
  const isAuthed = !!token || !!user
  if (isAuthed) return <Navigate to="/" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { token, user, isAdmin } = useSelector((s) => s.auth)
  const authed = !!token || !!user
  if (!authed) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
