import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 mt-auto">
      <div className="w-full px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-background">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3 A 9 9 0 0 1 12 21" fill="currentColor" />
              </svg>
            </div>
            <span className="text-sm font-bold">Aperture</span>
            <span className="text-xs text-muted-foreground">— See Arc liquidity</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="https://arc.network" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Arc Network</a>
            <a href="https://github.com/Mckenzie347" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <Link href="/pulse" className="hover:text-foreground transition-colors">Pulse</Link>
            <Link href="/alat" className="hover:text-foreground transition-colors">Tools</Link>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-border/50 pt-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Data refreshes every 30s · Mock data for development</p>
          <p>⚠ Not financial advice · DYOR · Built on Arc</p>
        </div>
      </div>
    </footer>
  );
}
