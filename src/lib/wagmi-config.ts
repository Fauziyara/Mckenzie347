"use client";

import { http, createConfig, createStorage } from "wagmi";
import { injected } from "wagmi/connectors";
import { type Chain } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

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

// RainbowKit config — handles all wallet UI/UX
export const config = getDefaultConfig({
  appName: "Arc Dashboard",
  projectId: "arc-dashboard-testnet", // WalletConnect project ID — get from https://cloud.walletconnect.com
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http("https://rpc.testnet.arc.network"),
  },
  ssr: true,
});

// Keep old config export for backward compatibility
export { config as wagmiConfig };
