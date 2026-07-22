"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/format";

export function SyncBadge({ syncedAt }: { syncedAt: number }) {
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
      </span>
      {mounted ? `Last synced ${timeAgo(syncedAt)}` : "Last synced —"}
    </div>
  );
}
