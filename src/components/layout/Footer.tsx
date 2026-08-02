import Link from "next/link";
import { Gamepad2, Heart, Shield, Zap } from "lucide-react";

export function Footer() {
  const categories = [
    "Action",
    "Puzzle",
    "Arcade",
    "Racing",
    "Adventure",
    "Strategy",
    "Sports",
    "Multiplayer",
  ];

  return (
    <footer className="w-full border-t border-border bg-shell pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">

          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                <Gamepad2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="font-display text-xl font-black text-foreground">
                PlayNow
              </span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed font-sans">
              PlayNow is an original HTML5 browser game portal. Enjoy instant, high-speed, fullscreen gaming without downloads or installs across all desktop and mobile browsers.
            </p>
            <div className="flex items-center space-x-4 text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-wider">
              <span className="flex items-center space-x-1">
                <Zap className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Zero Installs</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Safe & Sandboxed</span>
              </span>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              Game Categories
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="hover:text-primary transition-colors capitalize"
                  >
                    {cat} Games
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Featured Games
                </Link>
              </li>
              <li>
                <Link href="/search?sort=popular" className="hover:text-primary transition-colors">
                  Trending Now
                </Link>
              </li>
              <li>
                <Link href="/search?sort=newest" className="hover:text-primary transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/search?favorites=true" className="hover:text-primary transition-colors">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Built for Gamers */}
          <div className="space-y-3 md:col-span-4 lg:col-span-1">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
              Built for Gamers
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              Designed with cutting-edge web performance, dark mode elegance, and instant responsiveness. Made with Next.js 15 App Router & Tailwind CSS.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground font-mono">
          <p>© {new Date().getFullYear()} PlayNow Studios. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" aria-hidden="true" />
            <span>for Browser Gaming</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
