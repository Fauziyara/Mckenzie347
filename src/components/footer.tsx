export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="w-full px-6 lg:px-10 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="https://x.com/Arc_House" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">X / Twitter</a>
            <a href="https://t.me/Arc_House" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Telegram</a>
            <a href="https://discord.gg/arc-network" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Discord</a>
            <a href="https://github.com/Mckenzie347" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub</a>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1 border-t border-white/5 pt-4 text-[11px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p>Built on Arc</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
