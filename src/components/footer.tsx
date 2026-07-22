import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 mt-auto">
      <div className="w-full px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            {/* Aperture logo */}
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-background">
                <circle cx="12" cy="12" r="10" />
                <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
              </svg>
            </div>
            <span className="text-sm font-bold">Aperture</span>
            {/* Separator */}
            <span className="h-3.5 w-px bg-border" />
            {/* Arc logo — official */}
            <Image
              src="/arc-logo-official.svg"
              alt="Arc™"
              width={36}
              height={12}
              className="opacity-70"
            />
            <span className="text-xs text-muted-foreground">— DEX Scanner for Arc</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="https://arc.network" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Arc Network</a>
            <a href="https://github.com/Mckenzie347" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="/pulse" className="hover:text-foreground transition-colors">Pulse</a>
            <a href="/alat" className="hover:text-foreground transition-colors">Tools</a>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1 border-t border-border/50 pt-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Data refreshes every 30s · Mock data for development</p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p>⚠ Not financial advice · DYOR · Built on Arc</p>
            <p className="text-[10px] opacity-70">Arc is a trademark of Circle Internet Group, Inc. and/or its affiliates.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
