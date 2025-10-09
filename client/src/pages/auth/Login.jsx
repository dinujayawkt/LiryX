import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import api from '../../lib/api'
import { setToken, setUser } from '../../lib/auth'
import { setCredentials } from '../../store/slices/authSlice'
import Logo from '../../components/Logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      setUser(data.user)
      dispatch(setCredentials({ user: data.user, token: data.token }))
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen grid place-items-center bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(168,85,247,0.20),transparent_60%),radial-gradient(800px_400px_at_80%_120%,rgba(16,185,129,0.18),transparent_60%),#0a0a0a]">
      <div className="w-full max-w-md mx-auto p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_-20px_rgba(168,85,247,0.45)]">
        <div className="flex items-center gap-3 mb-5 justify-center">
          <Logo className="scale-125" withText />
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to LiryX</h1>
          <p className="text-neutral-400 text-sm mt-1">Sign in to continue</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="text-red-400 text-sm flex items-center gap-2"><i className='bx bxs-error-circle'></i>{error}</div>}
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Email</label>
            <div className="relative">
              <i className='bx bx-envelope absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'></i>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
                     className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-neutral-900/60 border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 placeholder-neutral-500" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Password</label>
            <div className="relative">
              <i className='bx bx-lock-alt absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'></i>
              <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
                     className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-neutral-900/60 border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 placeholder-neutral-500" placeholder="•••••••" />
            </div>
          </div>
          <button disabled={loading} className="group w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 disabled:opacity-60 font-medium shadow-[0_10px_30px_-10px_rgba(168,85,247,0.6)] transition-transform duration-200 active:scale-[0.98]">
            <span className="inline-flex items-center justify-center gap-2">
              <span>{loading ? 'Signing in…' : 'Sign in'}</span>
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 5L20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </button>
          <p className="text-sm text-neutral-400 text-center">No account? <NavLink className="text-purple-300 hover:underline" to="/register">Create one</NavLink></p>
        </form>
      </div>
    </section>
  )
}
