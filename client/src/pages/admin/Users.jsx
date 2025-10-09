import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setError('')
      const { data } = await api.get('/users')
      setUsers(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load users')
    }
  }

  async function removeUser(id) {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      setUsers((list) => list.filter((u) => u._id !== id))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete user')
    }
  }

  async function changeRole(id, current) {
    const next = current === 'admin' ? 'user' : 'admin'
    try {
      const { data } = await api.patch(`/users/${id}`, { role: next })
      setUsers((list) => list.map((u) => (u._id === id ? data : u)))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to change role')
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t border-neutral-800">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2"><span className={u.role === 'admin' ? 'text-purple-300' : 'text-neutral-300'}>{u.role}</span></td>
                <td className="p-2 flex gap-2">
                  <button onClick={()=>changeRole(u._id, u.role)} className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700">Make {u.role==='admin'?'User':'Admin'}</button>
                  <button onClick={()=>removeUser(u._id)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
