import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { setQueue, playAt } from '../store/slices/playerSlice'

export default function Search() {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.auth)
  const [q, setQ] = useState('')
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [favIds, setFavIds] = useState(new Set())

  useEffect(() => {
    // Load current favorites to show liked state
    if (!token) return
    api.get('/favorites').then(({ data }) => setFavIds(new Set(data.map((s)=>s._id)))).catch(()=>{})
  }, [token])

  useEffect(() => {
    // Show all on initial visit
    loadAll()
  }, [])

  async function loadAll() {
    try {
      setLoading(true); setError('')
      const [sRes, aRes] = await Promise.all([
        api.get('/songs'),
        api.get('/albums'),
      ])
      setSongs(sRes.data || [])
      setAlbums(aRes.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load music')
    } finally {
      setLoading(false)
    }
  }

  async function onSearch(e) {
    e?.preventDefault()
    if (!q.trim()) { await loadAll(); return }
    try {
      setLoading(true); setError('')
      const { data } = await api.get('/search', { params: { q } })
      setSongs(data.songs || [])
      setAlbums(data.albums || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to search')
    } finally {
      setLoading(false)
    }
  }

  function mapToTrack(song) {
    return { id: song._id, title: song.title, artist: song.artist || song.album?.artist || 'Unknown', url: song.audioUrl, cover: song.coverUrl || song.album?.coverUrl }
  }
  function playSongList(list, index) {
    const queue = list.map(mapToTrack)
    dispatch(setQueue(queue))
    dispatch(playAt(index))
  }

  async function toggleFav(songId) {
    try {
      const { data } = await api.post(`/favorites/${songId}`)
      const ids = new Set(data.favorites.map((s)=>s._id))
      setFavIds(ids)
    } catch {}
  }

  async function addToPlaylist(songId) {
    if (!token) return
    try {
      const { data: lists } = await api.get('/playlists')
      if (!lists.length) {
        alert('No playlists. Create one in Library first.')
        return
      }
      const mapping = lists.map((p, idx) => `${idx + 1}. ${p.title}`).join('\n')
      const choice = prompt(`Add to which playlist?\n${mapping}\nEnter number:`)
      const idx = Number(choice) - 1
      if (Number.isNaN(idx) || idx < 0 || idx >= lists.length) return
      const pl = lists[idx]
      await api.post(`/playlists/${pl._id}/tracks`, { songId })
      alert('Added to playlist')
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to add to playlist')
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Search</h1>
      <form onSubmit={onSearch} className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'></i>
          <input className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-neutral-900/60 border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 placeholder-neutral-500" placeholder="Search for songs or albums" value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 disabled:opacity-60 font-medium shadow-[0_10px_30px_-10px_rgba(168,85,247,0.6)] transition-transform active:scale-[0.98]">
          {loading? 'Searching…' : 'Search'}
        </button>
      </form>
      {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}

      {songs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Songs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {songs.map((s, i) => (
              <div
                key={s._id}
                className="group rounded-xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-purple-500/30 shadow-[0_10px_30px_-20px_rgba(168,85,247,0.45)] transition cursor-pointer"
                onClick={() => playSongList(songs, i)}
                title="Play"
              >
                <div className="relative">
                  {(s.coverUrl || s?.album?.coverUrl) ? (
                    <img src={s.coverUrl || s.album.coverUrl} alt={s.title} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="w-full aspect-square bg-neutral-800" />
                  )}
                  {token && (
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0 flex gap-2">
                      <button
                        className={`grid place-items-center w-9 h-9 rounded-full ${favIds.has(s._id)?'bg-emerald-600 hover:bg-emerald-500 text-white':'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200'} backdrop-blur`}
                        title={favIds.has(s._id)?'Favourited':'Add to favourites'}
                        onClick={(e) => { e.stopPropagation(); toggleFav(s._id) }}
                      >
                        <i className={`bx ${favIds.has(s._id)?'bxs-heart':'bx-heart'} text-lg`}></i>
                      </button>
                      <button
                        className="grid place-items-center w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 backdrop-blur"
                        title="Add to playlist"
                        onClick={(e) => { e.stopPropagation(); addToPlaylist(s._id) }}
                      >
                        <i className='bx bx-list-plus text-lg'></i>
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold truncate text-white">{s.title}</div>
                  <div className="text-xs text-neutral-400 truncate">{s.artist || s.album?.artist || 'Unknown'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
