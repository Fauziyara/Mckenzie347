"use client";
import dynamic from "next/dynamic";

const Providers = dynamic(() => import("@/components/providers").then(m => ({ default: m.Providers })), {
  ssr: false,
  loading: () => null,
});

export function ProvidersLazy({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
