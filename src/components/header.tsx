import Link from "next/link";
import { WalletButton } from "@/components/wallet-button";
import { TickerBar } from "@/components/ticker-bar";
import Image from "next/image";

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
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="w-full flex h-12 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            {/* Logo: Aperture | separator | Arc */}
            <a href="/" className="flex items-center gap-2.5">
              {/* Aperture logo — custom aperture/lens icon */}
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-background">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight">Aperture</span>
              {/* Separator */}
              <span className="h-4 w-px bg-border mx-0.5" />
              {/* Arc logo — official from Circle Brand Kit */}
              <Image
                src="/arc-logo-official.svg"
                alt="Arc™ — Arc is a trademark of Circle Internet Group, Inc."
                width={42}
                height={14}
                className="opacity-80"
                priority
              />
            </a>
            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    active === item.label
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/pulse"
              className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 transition-colors hover:bg-emerald-500/20"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-400">TESTNET LIVE</span>
            </Link>
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
      </header>
      <TickerBar />
    </>
  );
}
