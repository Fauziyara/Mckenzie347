export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="w-full px-6 lg:px-10 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="https://github.com/Mckenzie347" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub</a>
            <a href="/pulse" className="hover:text-emerald-400 transition-colors">Pulse</a>
            <a href="/tools" className="hover:text-emerald-400 transition-colors">Tools</a>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1 border-t border-white/5 pt-4 text-[11px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <span>Built on Arc™</span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p>⚠ Not financial advice · DYOR</p>
            <p className="text-[10px] opacity-70">Arc is a trademark of Circle Internet Group, Inc. and/or its affiliates.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
