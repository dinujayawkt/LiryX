import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { setQueue, playAt } from '../store/slices/playerSlice'

export default function Home() {
  const dispatch = useDispatch()
  const { token } = useSelector((s)=>s.auth)
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])
  const [error, setError] = useState('')
  const [favIds, setFavIds] = useState(new Set())

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setError('')
      const [sRes, aRes, fRes] = await Promise.all([
        api.get('/songs'),
        api.get('/albums'),
        token ? api.get('/favorites') : Promise.resolve({ data: [] }),
      ])
      setSongs(sRes.data)
      setAlbums(aRes.data)
      if (token) setFavIds(new Set((fRes.data || []).map((s)=>s._id)))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load music')
    }
  }

  function mapToTrack(song) {
    return {
      id: song._id,
      title: song.title,
      artist: song.artist || song.album?.artist || 'Unknown',
      url: song.audioUrl,
      cover: song.coverUrl || song.album?.coverUrl,
    }
  }

  function playSongList(list, index) {
    const queue = list.map(mapToTrack)
    dispatch(setQueue(queue))
    dispatch(playAt(index))
  }

  useEffect(() => {
    // load favorites separately to keep load() simple
    if (!token) { setFavIds(new Set()); return }
    api.get('/favorites').then(({data}) => setFavIds(new Set(data.map(s=>s._id)))).catch(()=>{})
  }, [token])

  async function toggleFav(songId) {
    if (!token) return
    try {
      const { data } = await api.post(`/favorites/${songId}`)
      setFavIds(new Set(data.favorites.map(s=>s._id)))
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
      <h1 className="text-2xl font-semibold mb-6">Home</h1>
      {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">New Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {albums.map((a) => (
            <Link to={`/album/${a._id}`} key={a._id} className="group block rounded-xl overflow-hidden bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-purple-500/30 shadow-[0_10px_30px_-20px_rgba(168,85,247,0.45)] transition">
              <div className="relative">
                {a.coverUrl ? (
                  <img src={a.coverUrl} alt={a.title} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-neutral-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-green-500 hover:bg-green-400 text-black shadow-lg">
                    <i className='bx bx-play text-xl translate-x-[1px]'></i>
                  </span>
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold truncate text-white">{a.title}</div>
                <div className="text-xs text-neutral-400 truncate">{a.artist}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Songs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400">
                <th className="p-2">#</th>
                <th className="p-2">Title</th>
                <th className="p-2">Album</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((s, i) => (
                <tr key={s._id} className="border-t border-neutral-800 hover:bg-white/5">
                  <td className="p-2 w-10 text-neutral-400">{i + 1}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      {s.coverUrl || s?.album?.coverUrl ? (
                        <img src={s.coverUrl || s.album.coverUrl} alt="cover" className="w-10 h-10 rounded object-cover" />
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
                    <div className="flex items-center justify-end gap-2">
                      <button className="grid place-items-center w-9 h-9 rounded-full bg-white text-black hover:scale-105 transition" title="Play" onClick={() => playSongList(songs, i)}>
                        <i className='bx bx-play text-xl translate-x-[1px]'></i>
                      </button>
                      {token && (
                        <>
                          <button className={`grid place-items-center w-9 h-9 rounded-full ${favIds.has(s._id)?'bg-emerald-600 hover:bg-emerald-500 text-white':'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'}`} title={favIds.has(s._id)?'Favourited':'Add to favourites'} onClick={()=>toggleFav(s._id)}>
                            <i className={`bx ${favIds.has(s._id)?'bxs-heart':'bx-heart'} text-lg`}></i>
                          </button>
                          <button className="grid place-items-center w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300" title="Add to playlist" onClick={()=>addToPlaylist(s._id)}>
                            <i className='bx bx-list-plus text-lg'></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
