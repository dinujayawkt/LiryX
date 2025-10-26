import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import api from '../lib/api'
import { setQueue, playAt } from '../store/slices/playerSlice'

export default function Playlist() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [playlist, setPlaylist] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [id])

  async function load() {
    try {
      setLoading(true); setError('')
      const { data } = await api.get(`/playlists/${id}`)
      setPlaylist(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load playlist')
    } finally { setLoading(false) }
  }

  function mapToTrack(song) {
    return { id: song._id, title: song.title, artist: song.artist || song.album?.artist || 'Unknown', url: song.audioUrl, cover: song.coverUrl || song.album?.coverUrl }
  }

  function playAll(startIndex = 0) {
    const tracks = (playlist?.tracks || []).map(mapToTrack)
    dispatch(setQueue(tracks))
    dispatch(playAt(startIndex))
  }

  async function removeTrack(songId) {
    try {
      await api.delete(`/playlists/${id}/tracks/${songId}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to remove track')
    }
  }

  async function searchSongs(e) {
    e.preventDefault()
    if (!query.trim()) { setResults([]); return }
    try {
      const { data } = await api.get('/search', { params: { q: query } })
      setResults(data.songs || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Search failed')
    }
  }

  async function addTrack(songId) {
    try {
      await api.post(`/playlists/${id}/tracks`, { songId })
      setQuery(''); setResults([])
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to add track')
    }
  }

  if (loading) return <section><p className="text-neutral-400">Loading…</p></section>
  if (error) return <section><div className="text-red-400 text-sm">{error}</div></section>
  if (!playlist) return <section><p className="text-neutral-400">Playlist not found.</p></section>

  return (
    <section>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-40 h-40 rounded bg-neutral-800" />
        <div>
          <div className="text-sm text-neutral-400">Playlist</div>
          <h1 className="text-3xl font-bold text-white">{playlist.title}</h1>
          <button className="mt-4 px-4 py-2 rounded-full bg-green-500 hover:bg-green-400 text-black font-semibold" onClick={() => playAll(0)} disabled={!playlist.tracks?.length}>Play</button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Tracks</h2>
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
              {(playlist.tracks || []).map((s, i) => (
                <tr key={s._id} className="border-t border-neutral-800 hover:bg-white/5">
                  <td className="p-2 w-10 text-neutral-400">{i + 1}</td>
                  <td className="p-2 text-white">{s.title}</td>
                  <td className="p-2 flex gap-2">
                    <button className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white" onClick={() => playAll(i)}>Play</button>
                    <button className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700" onClick={() => removeTrack(s._id)}>Remove</button>
                  </td>
                </tr>
              ))}
              {(!playlist.tracks || playlist.tracks.length === 0) && (
                <tr><td className="p-4 text-neutral-400" colSpan={3}>This playlist has no tracks yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Add songs</h2>
        <form onSubmit={searchSongs} className="mb-3 flex gap-2">
          <input className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none" placeholder="Search songs" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <button className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500">Search</button>
        </form>
        {results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-400">
                  <th className="p-2">Title</th>
                  <th className="p-2">Album</th>
                  <th className="p-2">Add</th>
                </tr>
              </thead>
              <tbody>
                {results.map((s) => (
                  <tr key={s._id} className="border-t border-neutral-800 hover:bg-white/5">
                    <td className="p-2 text-white">{s.title}</td>
                    <td className="p-2 text-neutral-300">{s.album?.title || '-'}</td>
                    <td className="p-2"><button className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => addTrack(s._id)}>Add</button></td>
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
