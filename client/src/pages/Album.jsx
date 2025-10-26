import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import api from '../lib/api'
import { setQueue, playAt } from '../store/slices/playerSlice'

export default function Album() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { token } = useSelector((s)=>s.auth)
  const [albums, setAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [favIds, setFavIds] = useState(new Set())

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    try {
      setLoading(true)
      setError('')
      const [aRes, sRes, fRes] = await Promise.all([
        api.get('/albums'),
        api.get('/songs'),
        token ? api.get('/favorites') : Promise.resolve({ data: [] }),
      ])
      setAlbums(aRes.data)
      setSongs(sRes.data)
      if (token) setFavIds(new Set((fRes.data || []).map((s)=>s._id)))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load album')
    } finally {
      setLoading(false)
    }
  }

  const album = useMemo(() => albums.find(a => a._id === id), [albums, id])
  const albumSongs = useMemo(() => songs.filter(s => s.album?._id === id), [songs, id])

  function mapToTrack(song) {
    return {
      id: song._id,
      title: song.title,
      artist: song.artist || album?.artist || 'Unknown',
      url: song.audioUrl,
      cover: song.coverUrl || album?.coverUrl,
    }
  }

  function playAlbumAt(index) {
    const queue = albumSongs.map(mapToTrack)
    dispatch(setQueue(queue))
    dispatch(playAt(index))
  }

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

  if (loading) return <section><p className="text-neutral-400">Loading…</p></section>
  if (error) return <section><div className="text-red-400 text-sm">{error}</div></section>
  if (!album) return <section><p className="text-neutral-400">Album not found.</p></section>

  return (
    <section>
      <div className="flex items-center gap-6 mb-6">
        {album.coverUrl ? (
          <img src={album.coverUrl} alt={album.title} className="w-40 h-40 object-cover rounded" />
        ) : (
          <div className="w-40 h-40 rounded bg-neutral-800" />
        )}
        <div>
          <div className="text-sm text-neutral-400">Album</div>
          <h1 className="text-3xl font-bold text-white">{album.title}</h1>
          <div className="text-neutral-300 mt-1">{album.artist} {album.year ? `• ${album.year}` : ''}</div>
          {albumSongs.length > 0 && (
            <button className="mt-4 px-4 py-2 rounded-full bg-green-500 hover:bg-green-400 text-black font-semibold" onClick={() => playAlbumAt(0)}>Play</button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="p-2">#</th>
              <th className="p-2">Title</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albumSongs.map((s, i) => (
              <tr key={s._id} className="border-t border-neutral-800 hover:bg-white/5">
                <td className="p-2 w-10 text-neutral-400">{i + 1}</td>
                <td className="p-2 text-white">{s.title}</td>
                <td className="p-2">
                  <div className="flex items-center justify-start gap-2">
                    <button className="grid place-items-center w-9 h-9 rounded-full bg-white text-black hover:scale-105 transition" title="Play" onClick={() => playAlbumAt(i)}>
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
            {albumSongs.length === 0 && (
              <tr><td className="p-4 text-neutral-400" colSpan={3}>No songs in this album yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
