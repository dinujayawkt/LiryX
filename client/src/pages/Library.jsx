import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../lib/api'
import { setQueue, playAt } from '../store/slices/playerSlice'

export default function Library() {
  const dispatch = useDispatch()
  const [playlists, setPlaylists] = useState([])
  const [favorites, setFavorites] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setError('')
      const [plRes, favRes] = await Promise.all([
        api.get('/playlists'),
        api.get('/favorites'),
      ])
      setPlaylists(plRes.data)
      setFavorites(favRes.data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load library')
    }
  }

  async function createPlaylist(e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await api.post('/playlists', { title: title.trim() })
      setTitle('')
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create playlist')
    }
  }

  async function deletePlaylist(id) {
    if (!confirm('Delete this playlist?')) return
    try {
      await api.delete(`/playlists/${id}`)
      setPlaylists((list) => list.filter((p) => p._id !== id))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete playlist')
    }
  }

  function mapToTrack(song) {
    return { id: song._id, title: song.title, artist: song.artist || song.album?.artist || 'Unknown', url: song.audioUrl, cover: song.coverUrl || song.album?.coverUrl }
  }
  function playFavs(index) {
    const queue = favorites.map(mapToTrack)
    dispatch(setQueue(queue))
    dispatch(playAt(index))
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Your Library</h1>
      {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Playlists</h2>
        <form onSubmit={createPlaylist} className="mb-4 flex gap-2">
          <input className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none" placeholder="New playlist title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <button className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500">Create</button>
        </form>
        {playlists.length === 0 ? (
          <div className="text-neutral-400 text-sm">No playlists yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {playlists.map(pl => (
              <div key={pl._id} className="rounded-lg p-3 bg-neutral-900/60 border border-neutral-800">
                <Link to={`/playlist/${pl._id}`} className="block">
                  <div className="w-full aspect-square rounded bg-neutral-800 mb-3" />
                  <div className="text-sm font-medium truncate text-white">{pl.title}</div>
                  <div className="text-xs text-neutral-400 truncate">{new Date(pl.updatedAt).toLocaleDateString()}</div>
                </Link>
                <button onClick={()=>deletePlaylist(pl._id)} className="mt-2 text-xs px-2 py-1 rounded bg-red-600 hover:bg-red-500">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Favourites</h2>
        {favorites.length === 0 ? (
          <div className="text-neutral-400 text-sm">You haven’t liked any songs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-400">
                  <th className="p-2">#</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Album</th>
                  <th className="p-2">Play</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((s, i) => (
                  <tr key={s._id} className="border-t border-neutral-800 hover:bg-white/5">
                    <td className="p-2 w-10 text-neutral-400">{i + 1}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        {s.coverUrl || s?.album?.coverUrl ? (
                          <img src={s.coverUrl || s.album?.coverUrl} alt="cover" className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-neutral-800" />
                        )}
                        <div>
                          <div className="text-white">{s.title}</div>
                          <div className="text-xs text-neutral-400">{s.artist || s.album?.artist || 'Unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-neutral-300">{s.album?.title || '-'}</td>
                    <td className="p-2">
                      <button className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white" onClick={() => playFavs(i)}>Play</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
