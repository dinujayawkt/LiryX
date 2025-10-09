import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import api from '../../lib/api'
import { setToken, setUser } from '../../lib/auth'
import { setCredentials } from '../../store/slices/authSlice'

export default function Register() {
  const [name, setName] = useState('')
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
      // Create account
      await api.post('/auth/register', { name, email, password })
      // Auto-login after register
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      setUser(data.user)
      dispatch(setCredentials({ user: data.user, token: data.token }))
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-56px)] grid place-items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-neutral-900 to-neutral-950">
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.15)]">
        <div className="flex items-center gap-2 mb-6">
          <i className='bx bx-user-plus text-2xl text-emerald-400'></i>
          <h1 className="text-2xl font-semibold">Create account</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="text-red-400 text-sm flex items-center gap-2"><i className='bx bxs-error-circle'></i>{error}</div>}
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Name</label>
            <div className="relative">
              <i className='bx bx-user absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'></i>
              <input type="text" required value={name} onChange={(e)=>setName(e.target.value)}
                     className="w-full pl-10 pr-3 py-2 rounded-lg bg-neutral-900/60 border border-white/10 focus:outline-none focus:border-emerald-500 placeholder-neutral-500" placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Email</label>
            <div className="relative">
              <i className='bx bx-envelope absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'></i>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
                     className="w-full pl-10 pr-3 py-2 rounded-lg bg-neutral-900/60 border border-white/10 focus:outline-none focus:border-emerald-500 placeholder-neutral-500" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-neutral-300">Password</label>
            <div className="relative">
              <i className='bx bx-lock-alt absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'></i>
              <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
                     className="w-full pl-10 pr-3 py-2 rounded-lg bg-neutral-900/60 border border-white/10 focus:outline-none focus:border-emerald-500 placeholder-neutral-500" placeholder="••••••••" />
            </div>
          </div>
          <button disabled={loading} className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 font-medium">
            {loading ? 'Creating…' : 'Create account'}
          </button>
          <p className="text-sm text-neutral-400 text-center">Already have an account? <NavLink className="text-emerald-400 hover:underline" to="/login">Sign in</NavLink></p>
        </form>
      </div>
    </section>
  )
}
