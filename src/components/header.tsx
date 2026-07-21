import Link from "next/link";
import { WalletButton } from "@/components/wallet-button";
import { TickerBar } from "@/components/ticker-bar";

const navItems = [
  { href: "/", label: "Explore" },
  { href: "/pulse", label: "Pulse" },
  { href: "/pelacak", label: "Tracker" },
  { href: "/portofolio", label: "Portfolio" },
  { href: "/earn", label: "Earn" },
  { href: "/swap", label: "Swap" },
  { href: "/alat", label: "Tools" },
];

export function Header({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="w-full flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-background">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3 A 9 9 0 0 1 12 21" fill="currentColor" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight">Aperture</span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  active === item.label
                    ? "bg-muted/50 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/pulse"
            className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 transition-colors hover:bg-emerald-500/20"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-400">TESTNET LIVE</span>
          </a>
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1 transition-colors hover:bg-blue-500/20 sm:flex"
            title="Claim USDC/EURC testnet tokens"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-400">
              <path d="M12 2v6m0 0c-2.5 0-5 1.5-5 4v8h10v-8c0-2.5-2.5-4-5-4z" />
              <circle cx="12" cy="14" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-xs font-medium text-blue-400">Faucet</span>
          </a>
          <WalletButton />
        </div>
      </div>
      <TickerBar />
    </header>
  );
}
