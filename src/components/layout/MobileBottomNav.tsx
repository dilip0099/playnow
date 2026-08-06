"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bookmark,
  ShoppingBag,
  Grid3X3,
  Unlock,
  X,
  Swords,
  Brain,
  Car,
  Joystick,
  Puzzle,
  Compass,
  Volleyball,
  UsersRound,
  Dices
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/unblocked-games", label: "Unblocked", icon: Unlock },
  { href: "/library", label: "Library", icon: Bookmark },
  { href: "/discover", label: "Store", icon: ShoppingBag },
];

const CATEGORIES = [
  { name: "Action", href: "/category/action", icon: Swords },
  { name: "Strategy", href: "/category/strategy", icon: Brain },
  { name: "Racing", href: "/category/racing", icon: Car },
  { name: "Arcade", href: "/category/arcade", icon: Joystick },
  { name: "Puzzle", href: "/category/puzzle", icon: Puzzle },
  { name: "Adventure", href: "/category/adventure", icon: Compass },
  { name: "Sports", href: "/category/sports", icon: Volleyball },
  { name: "Multiplayer", href: "/category/multiplayer", icon: UsersRound },
  { name: "Classic", href: "/category/classic", icon: Dices },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <>
      <nav aria-label="Main" className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-shell/95 backdrop-blur-xl border-t border-border px-2 py-2">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center space-y-1 p-1.5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}

          {/* Categories Button */}
          <button
            onClick={() => setIsCategoryOpen(true)}
            className={`flex flex-col items-center space-y-1 p-1.5 transition-colors ${
              pathname.startsWith("/category/") || isCategoryOpen
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid3X3 className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Categories</span>
          </button>
        </div>
      </nav>

      {/* Categories Drawer / Modal */}
      {isCategoryOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-md flex flex-col justify-end">
          <div className="bg-shell border-t border-border rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-display font-black text-foreground uppercase tracking-wide">
                Explore Game Categories
              </h2>
              <button
                onClick={() => setIsCategoryOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 pb-6">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = pathname === cat.href;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsCategoryOpen(false)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                        : "bg-card border-border/60 text-foreground hover:border-primary/50"
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-1.5 text-primary" />
                    <span className="text-xs font-bold font-mono tracking-tight">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
