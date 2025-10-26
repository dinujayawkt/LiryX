import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  current: null, // { id, title, artist, url, cover }
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  volume: 0.8,
  shuffle: false,
  repeat: 'off', // 'off' | 'one' | 'all'
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action) => {
      // Play a specific track (optionally part of queue)
      const track = action.payload
      if (track) {
        state.current = track
        // try to align index if track exists in queue
        const idx = state.queue.findIndex((t) => t.id === track.id)
        state.currentIndex = idx >= 0 ? idx : state.currentIndex
      }
      state.isPlaying = true
    },
    pause: (state) => {
      state.isPlaying = false
    },
    setQueue: (state, action) => {
      const list = action.payload || []
      state.queue = list
      // reset index to first if queue provided
      state.currentIndex = list.length ? 0 : -1
      state.current = list.length ? list[0] : null
    },
    playAt: (state, action) => {
      const idx = action.payload
      if (idx >= 0 && idx < state.queue.length) {
        state.currentIndex = idx
        state.current = state.queue[idx]
        state.isPlaying = true
      }
    },
    next: (state) => {
      const n = state.queue.length
      if (n <= 0) return
      if (state.shuffle) {
        if (n === 1) {
          state.currentIndex = 0
        } else {
          let idx = state.currentIndex
          while (idx === state.currentIndex) {
            idx = Math.floor(Math.random() * n)
          }
          state.currentIndex = idx
        }
        state.current = state.queue[state.currentIndex]
        state.isPlaying = true
        return
      }
      // repeat off: stop at end
      if (state.repeat === 'off') {
        if (state.currentIndex < n - 1) {
          state.currentIndex += 1
          state.current = state.queue[state.currentIndex]
          state.isPlaying = true
        } else {
          state.isPlaying = false
        }
        return
      }
      // repeat all: wrap
      const nextIdx = (state.currentIndex + 1) % n
      state.currentIndex = nextIdx
      state.current = state.queue[nextIdx]
      state.isPlaying = true
    },
    prev: (state) => {
      const n = state.queue.length
      if (n <= 0) return
      if (state.shuffle) {
        if (n === 1) {
          state.currentIndex = 0
        } else {
          let idx = state.currentIndex
          while (idx === state.currentIndex) {
            idx = Math.floor(Math.random() * n)
          }
          state.currentIndex = idx
        }
        state.current = state.queue[state.currentIndex]
        state.isPlaying = true
        return
      }
      if (state.repeat === 'off') {
        if (state.currentIndex > 0) {
          state.currentIndex -= 1
          state.current = state.queue[state.currentIndex]
          state.isPlaying = true
        } else {
          state.isPlaying = false
        }
        return
      }
      const prevIdx = (state.currentIndex - 1 + n) % n
      state.currentIndex = prevIdx
      state.current = state.queue[prevIdx]
      state.isPlaying = true
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle
    },
    cycleRepeat: (state) => {
      state.repeat = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off'
    },
  },
})

export const { play, pause, setQueue, playAt, next, prev, setVolume, toggleShuffle, cycleRepeat } = playerSlice.actions
export default playerSlice.reducer
