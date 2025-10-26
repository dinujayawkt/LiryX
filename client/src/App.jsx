import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Library from './pages/Library.jsx'
import Album from './pages/Album.jsx'
import Playlist from './pages/Playlist.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminSongs from './pages/admin/Songs.jsx'
import AdminAlbums from './pages/admin/Albums.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import PlayerBar from './components/PlayerBar.jsx'
import { RequireAuth, PublicOnly, RequireAdmin } from './components/RouteGuards.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth-only layout (no nav/player) */}
        <Route element={<AuthShell />}> 
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        </Route>

        {/* App layout (Spotify-like shell) */}
        <Route element={<AppShell />}> 
          {/* Protected routes */}
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/search" element={<RequireAuth><Search /></RequireAuth>} />
          <Route path="/library" element={<RequireAuth><Library /></RequireAuth>} />
          <Route path="/album/:id" element={<RequireAuth><Album /></RequireAuth>} />
          <Route path="/playlist/:id" element={<RequireAuth><Playlist /></RequireAuth>} />

          {/* Admin only */}
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/songs" element={<RequireAdmin><AdminSongs /></RequireAdmin>} />
          <Route path="/admin/albums" element={<RequireAdmin><AdminAlbums /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />

          {/* Fallback inside app shell */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

// Minimal wrapper for auth pages
function AuthShell() {
  return <Outlet />
}

// Main application shell with Topbar/Sidebar/PlayerBar
function AppShell() {
  return (
    <div className="h-full grid grid-rows-[auto_1fr_auto]">
      <Topbar />
      <div className="grid grid-cols-[280px_1fr] h-full">
        <Sidebar />
        <main className="p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <PlayerBar />
    </div>
  )
}
