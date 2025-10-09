import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export function RequireAuth({ children }) {
  const { token } = useSelector((s) => s.auth)
  const isAuthed = !!token
  const location = useLocation()
  if (!isAuthed) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export function PublicOnly({ children }) {
  const { token } = useSelector((s) => s.auth)
  const isAuthed = !!token
  if (isAuthed) return <Navigate to="/" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { token, isAdmin } = useSelector((s) => s.auth)
  const authed = !!token
  if (!authed) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
