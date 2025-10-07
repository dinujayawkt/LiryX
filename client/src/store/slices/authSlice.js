import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAdmin: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAdmin = !!user?.role && user.role === 'admin'
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAdmin = false
    },
    hydrate: (state, action) => {
      const { user, token } = action.payload || {}
      state.user = user || null
      state.token = token || null
      state.isAdmin = !!user?.role && user.role === 'admin'
    },
  },
})

export const { setCredentials, logout, hydrate } = authSlice.actions
export default authSlice.reducer
