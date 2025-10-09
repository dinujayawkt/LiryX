export default function Dashboard() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <a href="/admin/songs" className="p-4 rounded border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-colors block">
          <h3 className="font-medium">Songs</h3>
          <p className="text-neutral-400 text-sm">Add, edit, delete songs</p>
          <div className="mt-3 inline-flex items-center gap-2 text-purple-300">Go to Songs <span>→</span></div>
        </a>
        <a href="/admin/albums" className="p-4 rounded border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-colors block">
          <h3 className="font-medium">Albums</h3>
          <p className="text-neutral-400 text-sm">Create and manage albums</p>
          <div className="mt-3 inline-flex items-center gap-2 text-purple-300">Go to Albums <span>→</span></div>
        </a>
        <a href="/admin/users" className="p-4 rounded border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-colors block">
          <h3 className="font-medium">Users</h3>
          <p className="text-neutral-400 text-sm">Manage user access</p>
          <div className="mt-3 inline-flex items-center gap-2 text-purple-300">Go to Users <span>→</span></div>
        </a>
      </div>
    </section>
  )
}
