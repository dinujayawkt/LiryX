import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  current: null, // { id, title, artist, url, cover }
  isPlaying: false,
  queue: [],
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action) => {
      state.current = action.payload || state.current
      state.isPlaying = true
    },
    pause: (state) => {
      state.isPlaying = false
    },
    setQueue: (state, action) => {
      state.queue = action.payload || []
    },
  },
})

export const { play, pause, setQueue } = playerSlice.actions
export default playerSlice.reducer
