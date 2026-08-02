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
    <footer className="w-full border-t border-border/40 bg-background/60 backdrop-blur-md pt-12 pb-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-2 text-white">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-gradient-purple-cyan">
                GAMEHUB
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              GameHub is an original HTML5 browser game portal. Enjoy instant, high-speed, fullscreen gaming without downloads or installs across all desktop and mobile browsers.
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Zero Installs</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Safe & Sandboxed</span>
              </span>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Game Categories
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="hover:text-purple-400 transition-colors capitalize"
                  >
                    {cat} Games
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  Featured Games
                </Link>
              </li>
              <li>
                <Link href="/search?sort=popular" className="hover:text-purple-400 transition-colors">
                  Trending Now
                </Link>
              </li>
              <li>
                <Link href="/search?sort=newest" className="hover:text-purple-400 transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/search?favorites=true" className="hover:text-purple-400 transition-colors">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* SEO Statement */}
          <div className="space-y-3 md:col-span-4 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Built for Gamers
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed with cutting-edge web performance, dark mode elegance, and instant responsiveness. Made with Next.js 15 App Router & Tailwind CSS.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GameHub Studios. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
            <span>for Browser Gaming</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
