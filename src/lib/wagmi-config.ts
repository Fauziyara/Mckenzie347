"use client";

import { http, createConfig, createStorage } from "wagmi";
import { injected } from "wagmi/connectors";
import { type Chain } from "wagmi/chains";

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

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
  ],
  storage: createStorage({
    storage: isBrowser ? window.localStorage : (noopStorage as any),
  }),
  transports: {
    [arcTestnet.id]: http("https://rpc.testnet.arc.network"),
  },
});
