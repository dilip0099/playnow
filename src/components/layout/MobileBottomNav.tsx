"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, ShoppingBag, Heart } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: Bookmark },
  { href: "/discover", label: "Store", icon: ShoppingBag },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
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
      </div>
    </nav>
  );
}
