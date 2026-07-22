"use client";

import { useAccount, useDisconnect, useBalance, useConnect } from "wagmi";
import { formatUnits } from "viem";
import { useState, useRef, useEffect } from "react";

function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connectAsync, isPending } = useConnect();
  const { data: balance } = useBalance({ address: address });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!mounted) {
    return (
      <div className="relative">
        <button className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background opacity-50">
          Connect
        </button>
      </div>
    );
  }

  // Direct connect — klik langsung trigger wallet popup
  async function handleDirectConnect() {
    setError(null);
    try {
      const injectedConnector = connectors.find(c => c.id === "injected");
      if (!injectedConnector) {
        setError("No wallet detected. Install MetaMask.");
        return;
      }
      await connectAsync({ connector: injectedConnector });
    } catch (e: any) {
      console.error("Connect error:", e);
      if (e?.code === 4001) {
        setError("Connection rejected.");
      } else {
        setError(e?.message || "Failed to connect");
      }
    }
  }

  // Not connected — direct trigger
  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={handleDirectConnect}
          disabled={isPending}
          className="btn-lift flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-emerald-400 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 7h18v10H3z" />
                <path d="M3 10h18M7 14h4" />
              </svg>
              Connect
            </>
          )}
        </button>
        {error && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 animate-fade-in">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Connected
  const balStr = balance ? Number(formatUnits(balance.value, balance.decimals)).toFixed(2) : "0.00";
  const balSymbol = balance?.symbol || "USDC";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/50"
      >
        <span className="text-muted-foreground">
          {balStr} {balSymbol}
        </span>
        <span className="font-mono font-medium text-foreground">
          {shortAddr(address || "")}
        </span>
        <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-popover p-3 shadow-xl z-50 animate-fade-in">
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Connected Wallet</div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-foreground truncate">{address}</div>
                {chain && (
                  <div className="text-[10px] text-muted-foreground">
                    {chain.name} (#{chain.id})
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-3 rounded-md bg-muted/30 px-3 py-2">
            <div className="text-[10px] text-muted-foreground">Balance</div>
            <div className="text-sm font-semibold text-foreground">
              {balStr} {balSymbol}
            </div>
          </div>

          <div className="space-y-1">
            <a
              href={"https://testnet.arcscan.app/address/" + address}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-foreground transition-colors hover:bg-muted/50"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View on Arcscan
            </a>
            <button
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
