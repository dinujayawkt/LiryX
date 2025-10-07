import { NavLink } from 'react-router-dom'
import { FaHome, FaSearch, FaBook } from 'react-icons/fa'

export default function Sidebar() {
  const linkBase = 'flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-purple-500/10 transition-colors'
  const active = 'bg-purple-500/15 text-white border border-purple-500/20'
  return (
    <aside className="h-full bg-neutral-900/80 backdrop-blur border-r border-neutral-800 p-4">
      <h2 className="text-lg font-semibold mb-4 text-white">Lyrics</h2>
      <nav className="flex flex-col gap-2">
        <NavLink className={({isActive}) => `${linkBase} ${isActive ? active : 'text-neutral-300'}`} to="/">
          <FaHome /> Home
        </NavLink>
        <NavLink className={({isActive}) => `${linkBase} ${isActive ? active : 'text-neutral-300'}`} to="/search">
          <FaSearch /> Search
        </NavLink>
        <NavLink className={({isActive}) => `${linkBase} ${isActive ? active : 'text-neutral-300'}`} to="/library">
          <FaBook /> Your Library
        </NavLink>
        <div className="mt-6 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
          <NavLink className={({isActive}) => `${linkBase} ${isActive ? active : 'text-neutral-300'}`} to="/admin">
            Admin Dashboard
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
