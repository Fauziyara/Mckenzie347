"use client";

import { useAccount, useDisconnect, useBalance, useConnect } from "wagmi";
import { formatUnits } from "viem";
import { useState, useRef, useEffect } from "react";

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// Check if MetaMask is installed
function isMetaMaskInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.ethereum?.isMetaMask);
}

// Check if MetaMask is unlocked (has accounts)
async function isMetaMaskUnlocked(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) return false;
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return Array.isArray(accounts) && accounts.length > 0;
  } catch {
    return false;
  }
}

// Request accounts (unlock MetaMask)
async function requestAccounts(): Promise<string[]> {
  if (typeof window === "undefined" || !window.ethereum) throw new Error("No wallet");
  return window.ethereum.request({ method: "eth_requestAccounts" });
}

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connectAsync, isPending } = useConnect();
  const { data: balance } = useBalance({ address: address });
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mmState, setMmState] = useState<"checking" | "installed" | "not-installed" | "locked">("checking");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check MetaMask state when modal opens
  useEffect(() => {
    if (!modalOpen) return;
    
    async function checkState() {
      if (!isMetaMaskInstalled()) {
        setMmState("not-installed");
        return;
      }
      const unlocked = await isMetaMaskUnlocked();
      setMmState(unlocked ? "installed" : "locked");
    }
    
    checkState();
    
    // Listen for account changes (unlock event)
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) setMmState("installed");
    };
    
    window.ethereum?.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, [modalOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close modal on escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    if (modalOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [modalOpen]);

  if (!mounted) {
    return (
      <div className="relative">
        <button className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background opacity-50">
          Connect
        </button>
      </div>
    );
  }

  // Handle connect click
  async function handleConnect() {
    setError(null);
    setConnecting(true);
    
    try {
      // If MetaMask locked, request unlock first
      if (mmState === "locked") {
        setError("Please unlock MetaMask first");
        await requestAccounts();
        setMmState("installed");
      }
      
      // Connect via wagmi
      const injectedConnector = connectors.find(c => c.id === "injected");
      if (injectedConnector) {
        await connectAsync({ connector: injectedConnector });
        setModalOpen(false);
      } else {
        throw new Error("No injected connector found");
      }
    } catch (e: any) {
      console.error("Connect error:", e);
      if (e?.code === 4001) {
        setError("Connection rejected. Please try again.");
      } else if (e?.message?.includes("unlock")) {
        setError("Please unlock MetaMask and try again.");
      } else {
        setError(e?.message || "Failed to connect");
      }
    } finally {
      setConnecting(false);
    }
  }

  // Not connected
  if (!isConnected) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-lift flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-emerald-400"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 7h18v10H3z" />
            <path d="M3 10h18M7 14h4" />
          </svg>
          Connect
        </button>

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setModalOpen(false)}
            />
            
            {/* Modal Card */}
            <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-slide-up">
              {/* Close button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path d="M3 7h18v10H3z" />
                    <path d="M3 10h18M7 14h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Connect Wallet</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Connect to Arc Testnet (Chain 5042002)
                </p>
              </div>

              {/* Status Messages */}
              {mmState === "not-installed" && (
                <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                  <p className="text-xs text-amber-400">MetaMask not detected</p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-emerald-400 hover:underline"
                  >
                    Install MetaMask ↗
                  </a>
                </div>
              )}

              {mmState === "locked" && (
                <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                  <p className="text-xs text-amber-400">MetaMask is locked</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Click connect to unlock and connect
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Connect Button */}
              <button
                onClick={handleConnect}
                disabled={connecting || mmState === "not-installed" || mmState === "checking"}
                className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-background transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {connecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Connecting...
                  </span>
                ) : mmState === "locked" ? (
                  "Unlock & Connect MetaMask"
                ) : (
                  "Connect MetaMask"
                )}
              </button>

              {/* Footer */}
              <div className="mt-4 text-center">
                <p className="text-[10px] text-muted-foreground">
                  By connecting, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        )}
      </>
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
