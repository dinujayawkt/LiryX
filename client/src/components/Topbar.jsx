import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaUserCircle } from 'react-icons/fa'
import { logout as logoutAction } from '../store/slices/authSlice'
import { setToken as saveToken, setUser as saveUser } from '../lib/auth'

export default function Topbar() {
  const { user, token, isAdmin } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  function logout() {
    // clear token storage and redux state
    saveToken(null)
    saveUser(null)
    dispatch(logoutAction())
    setOpen(false)
    navigate('/login')
  }

  const isAuthed = !!token || !!user

  return (
    <header className="h-14 border-b border-purple-500/20 bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 flex items-center justify-between px-4 shadow-[0_10px_30px_-20px_rgba(168,85,247,0.35)]">
      <div className="font-semibold tracking-wide">Liryx</div>
      <div className="flex items-center gap-3 relative" ref={menuRef}>
        {!isAuthed ? (
          // No buttons here to keep auth as standalone pages like common platforms
          null
        ) : (
          <>
            {isAdmin && (
              <NavLink to="/admin" className="px-3 py-1 rounded-lg bg-purple-500/15 text-neutral-200 hover:bg-purple-500/25 border border-purple-500/20 text-sm">Admin</NavLink>
            )}
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-purple-500/10">
              <FaUserCircle className="text-xl" />
              <span className="text-sm">{user?.name || 'Profile'}</span>
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-purple-500/20 bg-neutral-900/95 backdrop-blur shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
                <div className="px-4 py-3">
                  <div className="text-sm font-medium">{user?.name || 'User'}</div>
                  <div className="text-xs text-neutral-400 truncate">{user?.email || ''}</div>
                </div>
                <div className="border-t border-purple-500/20" />
                <nav className="py-1">
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-purple-500/10">Logout</button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  )
}
