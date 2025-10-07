export default function PlayerBar() {
  return (
    <footer className="h-20 border-t border-purple-500/20 bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 flex items-center justify-between px-4 shadow-[0_-10px_30px_-20px_rgba(168,85,247,0.35)]">
      <div className="text-sm text-neutral-300">No song playing</div>
      <div className="text-xs text-neutral-400">Player controls will appear here</div>
    </footer>
  )
}
