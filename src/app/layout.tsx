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
  title: "Aperture — DEX Scanner",
  description: "Aperture is a real-time DEX pair scanner built on Arc Network. Track pairs, liquidity, volume, and transactions.",
  keywords: ["Aperture", "DEX", "scanner", "liquidity", "pairs", "DeFi", "Arc Network"],
  icons: {
    icon: "/aperture-logo.svg",
    shortcut: "/aperture-logo.svg",
    apple: "/aperture-logo.svg",
  },
  openGraph: {
    title: "Aperture — DEX Scanner",
    description: "Aperture is a real-time DEX pair scanner built on Arc Network.",
    type: "website",
  },
};

// Prevent theme flash — apply before hydration
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('aperture-theme') || 'dark';
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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