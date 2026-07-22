import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BottomNav } from "@/components/bottom-nav";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Aperture — DEX Scanner for Arc™",
  description: "See liquidity on Arc. Real-time DEX pair scanner for Arc network — track pairs, liquidity, volume, and transactions.",
  keywords: ["Arc", "DEX", "scanner", "liquidity", "pairs", "DeFi", "blockchain"],
  icons: {
    icon: "/arc-favicon.png",
    shortcut: "/arc-favicon.png",
    apple: "/arc-favicon.png",
  },
  openGraph: {
    title: "Aperture — DEX Scanner for Arc™",
    description: "See liquidity on Arc. Real-time DEX pair scanner for Arc network.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background text-foreground pb-16 sm:pb-0">
            {children}
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
