import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { play, pause, next, prev, setVolume, toggleShuffle, cycleRepeat } from '../store/slices/playerSlice'
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaRandom, FaRedo } from 'react-icons/fa'

export default function PlayerBar() {
  const dispatch = useDispatch()
  const { current, isPlaying, queue, currentIndex, volume, shuffle, repeat } = useSelector((s) => s.player)
  const audioRef = useRef(null)
  const [progress, setProgress] = useState(0) // seconds
  const [duration, setDuration] = useState(0) // seconds

  // Keep audio element in sync with redux state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current?.url) return
    if (audio.src !== current.url) {
      audio.src = current.url
    }
    if (isPlaying) {
      audio.play().catch(() => {/* ignore */})
    } else {
      audio.pause()
    }
  }, [current?.url, isPlaying])

  const onTimeUpdate = () => {
    const a = audioRef.current
    if (!a) return
    setProgress(a.currentTime || 0)
    setDuration(a.duration || 0)
  }

  const onEnded = () => {
    // repeat one: restart same track
    if (repeat === 'one') {
      const a = audioRef.current
      if (a) { a.currentTime = 0; a.play().catch(()=>{}) }
      return
    }
    // otherwise follow next (handles shuffle, repeat off/all)
    if (queue.length > 0) dispatch(next())
  }

  const togglePlay = () => {
    if (!current) return
    if (isPlaying) dispatch(pause())
    else dispatch(play())
  }

  const onSeek = (e) => {
    const a = audioRef.current
    if (!a) return
    const val = Number(e.target.value)
    a.currentTime = val
    setProgress(val)
  }

  const onVolume = (e) => {
    const val = Number(e.target.value)
    dispatch(setVolume(val))
  }

  return (
    <footer className="h-24 border-t border-purple-500/20 bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 flex items-center justify-between px-4 shadow-[0_-10px_30px_-20px_rgba(168,85,247,0.35)] gap-4">
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />

      <div className="min-w-[220px] flex items-center gap-3">
        {current?.cover ? (
          <img src={current.cover} className="w-12 h-12 object-cover rounded" alt="cover" />
        ) : (
          <div className="w-12 h-12 rounded bg-neutral-800" />
        )}
        <div>
          <div className="text-sm text-white truncate max-w-[220px]">{current?.title || 'Nothing playing'}</div>
          <div className="text-xs text-neutral-400 truncate max-w-[220px]">{current?.artist || ''}</div>
        </div>
      </div>

      <div className="flex-1 max-w-[700px]">
        <div className="flex items-center justify-center gap-4 mb-2">
          <button className={`p-2 rounded hover:bg-white/10 ${shuffle ? 'text-purple-400' : ''}`} onClick={() => dispatch(toggleShuffle())} title="Shuffle"><FaRandom /></button>
          <button className="p-2 rounded hover:bg-white/10" onClick={() => dispatch(prev())} disabled={!queue.length}><FaStepBackward /></button>
          <button className="p-3 rounded-full bg-white text-black hover:scale-105 transition" onClick={togglePlay} disabled={!current}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="p-2 rounded hover:bg-white/10" onClick={() => dispatch(next())} disabled={!queue.length}><FaStepForward /></button>
          <button className={`p-2 rounded hover:bg-white/10 ${repeat !== 'off' ? 'text-purple-400' : ''}`} onClick={() => dispatch(cycleRepeat())} title={`Repeat: ${repeat}`}>
            <FaRedo />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span>{formatTime(progress)}</span>
          <input type="range" min={0} max={Math.max(1, duration)} value={Math.min(progress, duration || 0)} onChange={onSeek} className="flex-1 accent-purple-500" />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="min-w-[180px] flex items-center gap-2 justify-end text-neutral-300">
        <FaVolumeUp />
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={onVolume} className="w-28 accent-purple-500" />
      </div>
    </footer>
  )
}

function formatTime(sec) {
  if (!sec || !isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
