export default function Dashboard() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded border border-neutral-800 bg-neutral-900">
          <h3 className="font-medium">Songs</h3>
          <p className="text-neutral-400 text-sm">Add, edit, delete songs</p>
        </div>
        <div className="p-4 rounded border border-neutral-800 bg-neutral-900">
          <h3 className="font-medium">Albums</h3>
          <p className="text-neutral-400 text-sm">Create and manage albums</p>
        </div>
        <div className="p-4 rounded border border-neutral-800 bg-neutral-900">
          <h3 className="font-medium">Users</h3>
          <p className="text-neutral-400 text-sm">Manage user access</p>
        </div>
      </div>
    </section>
  )
}
