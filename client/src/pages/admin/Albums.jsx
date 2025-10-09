import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function Albums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [year, setYear] = useState('')
  const [cover, setCover] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setError('')
      const { data } = await api.get('/albums')
      setAlbums(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load albums')
    }
  }

  async function createAlbum(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('artist', artist)
      if (year) fd.append('year', year)
      if (cover) fd.append('image', cover)
      await api.post('/albums', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setTitle(''); setArtist(''); setYear(''); setCover(null)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create album')
    } finally {
      setLoading(false)
    }
  }

  async function updateAlbum(id) {
    const nextTitle = prompt('New title?')
    if (!nextTitle) return
    try {
      const { data } = await api.patch(`/albums/${id}`, { title: nextTitle })
      setAlbums((list) => list.map((a) => (a._id === id ? data : a)))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update album')
    }
  }

  async function removeAlbum(id) {
    if (!confirm('Delete this album?')) return
    try {
      await api.delete(`/albums/${id}`)
      setAlbums((list) => list.filter((a) => a._id !== id))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete album')
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Manage Albums</h1>
      {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}

      <form onSubmit={createAlbum} className="grid md:grid-cols-5 gap-3 p-4 rounded-lg border border-neutral-800 bg-neutral-900/70 mb-6">
        <input className="col-span-1 px-3 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <input className="col-span-1 px-3 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none" placeholder="Artist" value={artist} onChange={(e)=>setArtist(e.target.value)} required />
        <input className="col-span-1 px-3 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none" placeholder="Year" value={year} onChange={(e)=>setYear(e.target.value)} />
        <input type="file" accept="image/*" className="col-span-1 file:mr-3 file:px-3 file:py-2 file:rounded file:bg-purple-600 file:text-white text-sm" onChange={(e)=>setCover(e.target.files?.[0]||null)} />
        <button disabled={loading} className="col-span-1 px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 transition disabled:opacity-60">{loading? 'Creating…' : 'Add Album'}</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="p-2">Cover</th>
              <th className="p-2">Title</th>
              <th className="p-2">Artist</th>
              <th className="p-2">Year</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.map(a => (
              <tr key={a._id} className="border-t border-neutral-800">
                <td className="p-2">{a.coverUrl ? <img src={a.coverUrl} alt="cover" className="w-10 h-10 rounded object-cover"/> : '-'}</td>
                <td className="p-2">{a.title}</td>
                <td className="p-2">{a.artist}</td>
                <td className="p-2">{a.year || '-'}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={()=>updateAlbum(a._id)} className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700">Edit</button>
                  <button onClick={()=>removeAlbum(a._id)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
