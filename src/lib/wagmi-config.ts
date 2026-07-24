"use client";

import { http, createConfig, createStorage } from "wagmi";
import { injected } from "wagmi/connectors";
import { type Chain } from "wagmi/chains";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createAppKit } from "@reown/appkit/react";

export const arcTestnet: Chain = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
    public: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "Arcscan", url: "https://testnet.arcscan.app" },
  },
  testnet: true,
};

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const isBrowser = typeof window !== "undefined";

// Wagmi adapter untuk Reown AppKit
export const wagmiAdapter = new WagmiAdapter({
  networks: [arcTestnet],
  projectId: "aperture-dex-scanner",
  ssr: true,
  storage: createStorage({
    storage: isBrowser ? window.localStorage : (noopStorage as any),
  }),
  transports: {
    [arcTestnet.id]: http("https://rpc.testnet.arc.network"),
  },
});

// Create AppKit instance — Aperture branding (NOT Arc)
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [arcTestnet],
  projectId: "aperture-dex-scanner",
  metadata: {
    name: "Aperture",
    description: "Aperture — DEX Scanner built on Arc Network",
    url: "https://aperture.app",
    icons: ["/aperture-logo.svg"],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#10b981",
    "--w3m-border-radius-master": "2px",
  },
});

// Export wagmi config dari adapter
export const config = wagmiAdapter.wagmiConfig;
export { config as wagmiConfig };