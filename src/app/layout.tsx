import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const sora = Sora({ 
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap"
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

const DEFAULT_DESCRIPTION =
  "Play 180+ free HTML5 browser games instantly on PlayNow — no downloads, no installs. Action, puzzle, arcade, racing, strategy, sports and multiplayer games.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PlayNow - Kinetic Obsidian Gaming Marketplace",
    template: "%s | PlayNow Browser Games",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: ["HTML5 games", "PlayNow", "browser games", "instant games", "free online games"],
  authors: [{ name: "PlayNow Studios" }],
  creator: "PlayNow Studios",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "PlayNow - Kinetic Obsidian Gaming Marketplace",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayNow - Kinetic Obsidian Gaming Marketplace",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastProvider>
            <div className="relative flex min-h-screen bg-background">
              {/* Left Fixed Sidebar */}
              <Sidebar />

              {/* Main Content Area Offset for Sidebar */}
              <div className="flex flex-1 flex-col lg:pl-60 min-w-0">
                <Navbar />
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
                <Footer />
                <MobileBottomNav />
              </div>
            </div>
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
