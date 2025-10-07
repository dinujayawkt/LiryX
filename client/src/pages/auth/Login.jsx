import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import api from '../../lib/api'
import { setToken, setUser } from '../../lib/auth'
import { setCredentials } from '../../store/slices/authSlice'

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
    <section className="min-h-screen grid place-items-center bg-[radial-gradient(1200px_600px_at_50%_-80px,rgba(168,85,247,0.25),transparent)] bg-neutral-950">
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl border border-purple-500/20 bg-neutral-900/60 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.18)]">
        <div className="flex items-center gap-2 mb-6">
          <i className='bx bx-log-in text-2xl text-purple-400'></i>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="text-red-400 text-sm flex items-center gap-2"><i className='bx bxs-error-circle'></i>{error}</div>}
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Email</label>
            <div className="relative">
              <i className='bx bx-envelope absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'></i>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
                     className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-neutral-900/70 border border-white/10 focus:outline-none focus:border-purple-500 placeholder-neutral-500" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Password</label>
            <div className="relative">
              <i className='bx bx-lock-alt absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'></i>
              <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
                     className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-neutral-900/70 border border-white/10 focus:outline-none focus:border-purple-500 placeholder-neutral-500" placeholder="••••••••" />
            </div>
          </div>
          <button disabled={loading} className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-60 font-medium shadow-[0_10px_30px_-10px_rgba(168,85,247,0.6)]">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-sm text-neutral-400 text-center">No account? <NavLink className="text-purple-400 hover:underline" to="/register">Create one</NavLink></p>
        </form>
      </div>
    </section>
  )
}
