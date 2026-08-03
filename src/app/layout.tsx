import type { Metadata } from "next";
import Script from "next/script";
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

// Title/description lead with "free online games" (368K/mo) and "online games" (450K/mo) —
// real, verified 2026 search volume — not "Kinetic Obsidian", which is our internal design-
// system codename and something literally zero users search for. The single most valuable
// piece of on-page SEO real estate should never be spent on internal jargon.
const DEFAULT_TITLE = "Free Online Games - Play 180+ Games Instantly, No Download";
const DEFAULT_DESCRIPTION =
  "Play free online games instantly in your browser — no downloads, no installs, no signup. Action, puzzle, arcade, racing, strategy, sports, and .io multiplayer games.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${DEFAULT_TITLE} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: ["free online games", "online games", "browser games", "io games", "play games online", "no download games"],
  authors: [{ name: "PlayNow Studios" }],
  creator: "PlayNow Studios",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
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
