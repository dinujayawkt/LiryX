import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { hydrate } from './store/slices/authSlice.js'
import { getToken, getUser } from './lib/auth.js'
import './index.css'
import App from './App.jsx'

// Hydrate auth state from localStorage before rendering
const preToken = getToken()
if (preToken) {
  const preUser = getUser()
  store.dispatch(hydrate({ user: preUser || null, token: preToken }))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
