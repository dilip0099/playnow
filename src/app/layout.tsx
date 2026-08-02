import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "GameHub - Free Online HTML5 Browser Games",
    template: "%s | GameHub Browser Games",
  },
  description:
    "Play high-quality HTML5 browser games for free on GameHub. Zero downloads, instant loading, smooth action, puzzle, arcade, racing games and more.",
  keywords: [
    "HTML5 games",
    "free browser games",
    "online games",
    "instant games",
    "snake game",
    "space shooter",
    "memory puzzle",
  ],
  authors: [{ name: "GameHub Studios" }],
  creator: "GameHub Studios",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamehub.local",
    siteName: "GameHub",
    title: "GameHub - Free Online HTML5 Browser Games",
    description:
      "Play instant high-quality HTML5 browser games for free. No downloads required.",
    images: [
      {
        url: "/games/neon-snake/thumbnail.svg",
        width: 1200,
        height: 630,
        alt: "GameHub Browser Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GameHub - Free Online HTML5 Browser Games",
    description:
      "Play instant high-quality HTML5 browser games for free on desktop and mobile.",
    images: ["/games/neon-snake/thumbnail.svg"],
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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} min-h-screen bg-[#050505] text-white flex flex-col antialiased pb-16 md:pb-0`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
