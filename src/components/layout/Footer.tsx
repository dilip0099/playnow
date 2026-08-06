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
    "Classic",
  ];

  return (
    <footer className="w-full border-t border-border bg-shell pt-6 sm:pt-12 pb-6 sm:pb-8">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        
        {/* Top Grid: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-6 sm:gap-8">

          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <span className="font-display text-lg sm:text-xl font-black text-foreground">
                PlayThorn
              </span>
            </Link>
            <p className="text-[11px] sm:text-xs text-muted-foreground max-w-sm leading-relaxed font-sans">
              PlayThorn is an original HTML5 browser game portal. Enjoy instant, high-speed, fullscreen gaming without downloads or installs across all desktop and mobile browsers.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[9px] sm:text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-wider">
              <span className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-primary" aria-hidden="true" />
                <span>Zero Installs</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="h-3 w-3 text-primary" aria-hidden="true" />
                <span>Safe & Sandboxed</span>
              </span>
            </div>
          </div>

          {/* Links Area: 2-Cols on Mobile, Multi-col on Desktop */}
          <div className="md:col-span-3 lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-6">
            
            {/* Categories Col */}
            <div className="space-y-2.5">
              <h3 className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                Categories
              </h3>
              <ul className="space-y-1.5 text-[11px] sm:text-xs text-muted-foreground">
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
            <div className="space-y-2.5">
              <h3 className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                Quick Links
              </h3>
              <ul className="space-y-1.5 text-[11px] sm:text-xs text-muted-foreground">
                <li>
                  <Link href="/unblocked-games" className="hover:text-primary transition-colors">
                    Unblocked Games
                  </Link>
                </li>
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

            {/* Legal Col */}
            <div className="space-y-2.5 col-span-2 sm:col-span-1">
              <h3 className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                Legal
              </h3>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/legal/dmca" className="hover:text-primary transition-colors">
                    DMCA
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] sm:text-[10px] text-muted-foreground font-mono text-center sm:text-left">
          <p>© {new Date().getFullYear()} PlayThorn Studios. All rights reserved.</p>
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
