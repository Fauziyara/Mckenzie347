"use client";

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { useState, useRef, useEffect } from "react";

function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address: address });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Prevent hydration mismatch - only render wallet UI on client
  if (!mounted) {
    return (
      <div className="relative">
        <button className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background opacity-50">
          Connect
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-emerald-400"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 7h18v10H3z" />
            <path d="M3 10h18M7 14h4" />
          </svg>
          Connect
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-popover p-2 shadow-xl z-50">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pilih Wallet
            </div>
            {connectors.length === 0 ? (
              <div className="px-2 py-3 text-center text-xs text-muted-foreground">
                Tidak ada wallet terdeteksi.
                <br />
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  Install MetaMask ↗
                </a>
              </div>
            ) : (
              connectors.map((c) => (
                <button
                  key={c.uid}
                  onClick={async () => {
                    try {
                      await connectAsync({ connector: c });
                      setOpen(false);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  disabled={isPending}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs transition-colors hover:bg-muted/50 disabled:opacity-50"
                >
                  <span className="font-medium text-foreground">{c.name}</span>
                </button>
              ))
            )}
            <div className="mt-1 border-t border-border px-2 pt-2 text-[10px] text-muted-foreground">
              Arc Testnet (Chain 5042002)
            </div>
          </div>
        )}
      </div>
    );
  }

  const balStr = balance ? Number(formatUnits(balance.value, balance.decimals)).toFixed(2) : "0.00";
  const balSymbol = balance?.symbol || "USDC";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
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
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-popover p-2 shadow-xl z-50">
          <div className="border-b border-border px-2 pb-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Terhubung</div>
            <div className="font-mono text-xs text-foreground break-all">{address}</div>
            {chain && (
              <div className="mt-1 text-[10px] text-muted-foreground">
                {chain.name} (#{chain.id})
              </div>
            )}
          </div>
          <a
            href={"https://testnet.arcscan.app/address/" + address}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md px-2 py-2 text-xs text-foreground transition-colors hover:bg-muted/50"
          >
            View on Arcscan ↗
          </a>
          <button
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="block w-full rounded-md px-2 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10"
          >
            Putuskan
          </button>
        </div>
      )}
    </div>
  );
}
