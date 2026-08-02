"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bookmark,
  ShoppingBag,
  Heart,
  Gamepad2,
  Swords,
  Brain,
  Car,
  Joystick,
  Puzzle,
  Compass,
  Volleyball,
  UsersRound
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", href: "/", icon: Home },
    { name: "LIBRARY", href: "/library", icon: Bookmark },
    { name: "STORE", href: "/discover", icon: ShoppingBag },
    { name: "FAVORITES", href: "/favorites", icon: Heart },
  ];

  // Same icon set as the homepage's Popular Genres grid — one visual language for "this is
  // a genre" across the whole site, and a persistent one-click path to every category from
  // any page (the CrazyGames/Poki pattern — this genre of site keeps categories in the
  // permanent nav, unlike a general app store where they'd hide behind a top-nav dropdown).
  const categoryItems = [
    { name: "Action", href: "/category/action", icon: Swords },
    { name: "Strategy", href: "/category/strategy", icon: Brain },
    { name: "Racing", href: "/category/racing", icon: Car },
    { name: "Arcade", href: "/category/arcade", icon: Joystick },
    { name: "Puzzle", href: "/category/puzzle", icon: Puzzle },
    { name: "Adventure", href: "/category/adventure", icon: Compass },
    { name: "Sports", href: "/category/sports", icon: Volleyball },
    { name: "Multiplayer", href: "/category/multiplayer", icon: UsersRound },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-border bg-shell lg:flex">
      {/* Brand Logo — fixed, never scrolls */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md group-hover:scale-105 transition-transform">
            <Gamepad2 className="h-5 w-5 fill-current" aria-hidden="true" />
          </div>
          <span className="font-display text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
            PlayNow
          </span>
        </Link>
      </div>

      {/* Scrollable nav area — logo stays put, this scrolls independently */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6">
        <nav aria-label="Main" className="space-y-2 font-mono text-xs font-bold tracking-wider">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow-primary font-black"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2">
          <span className="px-4 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            Browse
          </span>
          <nav aria-label="Categories" className="space-y-1 font-mono text-xs font-bold tracking-wider">
            {categoryItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-2 transition-all ${
                    isActive
                      ? "bg-accent text-primary font-black"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
