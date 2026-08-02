"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Compass, Bookmark, Heart, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Store", icon: Gamepad2 },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/library", label: "Library", icon: Bookmark },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 p-1.5 transition-colors ${
                isActive ? "text-purple-400" : "text-zinc-500 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
