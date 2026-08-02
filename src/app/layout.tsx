import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

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

export const metadata: Metadata = {
  title: {
    default: "PlayNow - Kinetic Obsidian Gaming Marketplace",
    template: "%s | PlayNow Browser Games",
  },
  description:
    "Experience zero-latency HTML5 browser games on PlayNow. Instant play, smooth performance, action, puzzle, arcade, racing games and more.",
  keywords: ["HTML5 games", "PlayNow", "browser games", "instant games"],
  authors: [{ name: "PlayNow Studios" }],
  creator: "PlayNow Studios",
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
      </body>
    </html>
  );
}
