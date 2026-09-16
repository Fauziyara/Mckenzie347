"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
const WalletButton = dynamic(() => import("@/components/wallet-button").then((m: any) => m.WalletButton), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-1.5 rounded-md bg-emerald-500/50 px-3 py-1.5 text-xs font-semibold text-background opacity-50">
      Connect
    </div>
  ),
});
import { TickerBar } from "@/components/ticker-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home", hasDropdown: false },
  { href: "/explore", label: "Explore", hasDropdown: false },
  { href: "/pulse", label: "Pulse", hasDropdown: false },
  { href: "/swap", label: "Swap", hasDropdown: false },
  { href: "#", label: "Tools", hasDropdown: true, submenu: [
    { href: "/tracker", label: "Tracker" },
  ]},
  { href: "/portfolio", label: "Portfolio", hasDropdown: false },
  { href: "/earn", label: "Earn", hasDropdown: false },
];

export function Header({ active, showTicker = true, showFaucet = true, logoColor = "black" }: { active?: string; showTicker?: boolean; showFaucet?: boolean; logoColor?: "black" | "green" }) {
  return (
    <>
      <header className="sticky top-0 z-50" style={{
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div className="relative w-full flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 lg:px-10">
          {/* Left — Logo */}
          <div className="flex items-center gap-3 z-10">
            <a href="/" className="flex items-center gap-2.5">
              <Image
                src={logoColor === "green" ? "/logo-arc-green.png" : "/logo-arc.png"}
                alt="Aperture"
                width={36}
                height={36}
                priority
                className="w-7 h-7 sm:w-9 sm:h-9"
              />
              <span className="hidden sm:inline text-lg font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading, 'Space Grotesk'), sans-serif" }}>
                Aperture
              </span>
            </a>
          </div>

          {/* Center — Menu (absolute centered, Intellio style) */}
          <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                    active === item.label
                      ? "text-emerald-400"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-50">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </Link>
                {/* Dropdown */}
                {item.hasDropdown && item.submenu && (
                  <div className="absolute top-full left-0 mt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                    <div className="rounded-xl py-2 min-w-[160px]" style={{
                      background: "rgba(10, 10, 20, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    }}>
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-white/60 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right — CTA + Wallet */}
          <div className="flex items-center gap-1.5 sm:gap-3 z-10">
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors cursor-default"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">Testnet Live</span>
            </div>
            {showFaucet && (
            <a
              href="https://faucet.circle.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #10b981, #5ee9b5)",
                boxShadow: "0 4px 20px rgba(16, 185, 129, 0.25)",
                color: "#000",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v6m0 0c-2.5 0-5 1.5-5 4v8h10v-8c0-2.5-2.5-4-5-4z" />
                <circle cx="12" cy="14" r="1.5" fill="currentColor" />
              </svg>
              Faucet
            </a>
            )}
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </header>
      {showTicker && <TickerBar />}
    </>
  );
}
