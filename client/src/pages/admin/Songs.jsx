import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function Songs() {
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [albumId, setAlbumId] = useState('')
  const [audio, setAudio] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setError('')
      const [sRes, aRes] = await Promise.all([
        api.get('/songs'),
        api.get('/albums'),
      ])
      setSongs(sRes.data)
      setAlbums(aRes.data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load data')
    }
  }

  async function createSong(e) {
    e.preventDefault()
    if (!audio) return setError('Please choose an audio file')
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('artist', artist)
      if (albumId) fd.append('albumId', albumId)
      fd.append('audio', audio)
      await api.post('/songs', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setTitle(''); setArtist(''); setAlbumId(''); setAudio(null)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create song')
    } finally {
      setLoading(false)
    }
  }

  async function uploadCover(id, file) {
    if (!file) return
    const fd = new FormData()
    fd.append('image', file)
    try {
      await api.post(`/songs/${id}/cover`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to upload cover')
    }
  }

  async function removeSong(id) {
    if (!confirm('Delete this song?')) return
    try {
      await api.delete(`/songs/${id}`)
      setSongs((s) => s.filter((x) => x._id !== id))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete song')
    }
  }

  async function saveInline(song) {
    try {
      // We don't have an explicit PATCH endpoint for songs in server; use replace-like pattern
      // For demo, just delete+recreate is too heavy. Instead, if server later adds PATCH, wire it here.
      // Skip inline save; rely on future endpoint.
      alert('Inline edit save is not available yet on server. Add a PATCH /songs/:id to enable.')
    } catch (e) {
      setError('Failed to save changes')
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Manage Songs</h1>
      {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}

      <form onSubmit={createSong} className="grid md:grid-cols-5 gap-3 p-4 rounded-lg border border-neutral-800 bg-neutral-900/70 mb-6">
        <input className="col-span-1 px-3 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <input className="col-span-1 px-3 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none" placeholder="Artist" value={artist} onChange={(e)=>setArtist(e.target.value)} required />
        <select className="col-span-1 px-3 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none" value={albumId} onChange={(e)=>setAlbumId(e.target.value)}>
          <option value="">No album</option>
          {albums.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
        </select>
        <input type="file" accept="audio/*" className="col-span-1 file:mr-3 file:px-3 file:py-2 file:rounded file:bg-purple-600 file:text-white text-sm" onChange={(e)=>setAudio(e.target.files?.[0]||null)} />
        <button disabled={loading} className="col-span-1 px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 transition disabled:opacity-60">{loading? 'Uploading…' : 'Add Song'}</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="p-2">Title</th>
              <th className="p-2">Artist</th>
              <th className="p-2">Album</th>
              <th className="p-2">Audio</th>
              <th className="p-2">Cover</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(s => (
              <tr key={s._id} className="border-t border-neutral-800">
                <td className="p-2">{s.title}</td>
                <td className="p-2">{s.artist}</td>
                <td className="p-2">{s.album?.title || '-'}</td>
                <td className="p-2 truncate max-w-[200px]"><a className="text-purple-400 hover:underline" href={s.audioUrl} target="_blank" rel="noreferrer">audio</a></td>
                <td className="p-2">
                  {s.coverUrl ? (
                    <img alt="cover" src={s.coverUrl} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <label className="text-xs text-neutral-400 cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e)=>uploadCover(s._id, e.target.files?.[0])} />
                      Upload cover
                    </label>
                  )}
                </td>
                <td className="p-2 flex gap-2">
                  <button onClick={()=>removeSong(s._id)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
