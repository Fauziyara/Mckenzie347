export function formatUsd(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "$0.00";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export function formatNumber(n: number, decimals = 2): string {
  if (!isFinite(n) || isNaN(n)) return "0";
  if (n >= 1e9) return `${(n / 1e9).toFixed(decimals)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(decimals)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

export function formatPrice(n: number): string {
  if (!isFinite(n) || isNaN(n) || n === 0) return "0";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  if (n > 0) return n.toFixed(8);
  return "0";
}

export function shortAddr(addr: string, chars = 6): string {
  if (!addr) return "";
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}

export function timeAgo(unix: number): string {
  const diff = Math.floor(Date.now() / 1000) - unix;
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatPct(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "0.00%";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}
