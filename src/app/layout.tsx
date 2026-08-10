import type { Metadata } from "next";

import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";


export const metadata: Metadata = {
  title: "Aperture — DEX Scanner",
  description: "Aperture is a real-time DEX pair scanner built on Arc Network.",
  icons: { icon: "/logo-arc.png", shortcut: "/logo-arc.png", apple: "/logo-arc.png" },
};

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem("aperture-theme") || "dark";
    if (theme === "light") document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");
  } catch(e) { document.documentElement.classList.add("dark"); }
  window.addEventListener("error", function(e) {
    if (e.message && (e.message.indexOf("Loading chunk") !== -1 || e.message.indexOf("ChunkLoadError") !== -1)) {
      if (!sessionStorage.getItem("cr")) { sessionStorage.setItem("cr","1"); window.location.reload(); }
    }
  });
  window.addEventListener("unhandledrejection", function(e) {
    var m = e.reason && e.reason.message || "";
    if (m.indexOf("Loading chunk") !== -1 || m.indexOf("ChunkLoadError") !== -1 || m.indexOf("dynamically imported") !== -1) {
      if (!sessionStorage.getItem("cr")) { sessionStorage.setItem("cr","1"); window.location.reload(); }
    }
  });
  window.addEventListener("load", function() { sessionStorage.removeItem("cr"); });
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,500;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" /><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className={`antialiased`}>
        <div className="flex min-h-screen flex-col bg-background text-foreground pb-16 sm:pb-0">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
