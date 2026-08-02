"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bookmark,
  ShoppingBag,
  Users,
  Gamepad2
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "HOME", href: "/", icon: Home },
    { name: "LIBRARY", href: "/library", icon: Bookmark },
    { name: "STORE", href: "/discover", icon: ShoppingBag },
    { name: "COMMUNITY", href: "/developers", icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col justify-between border-r border-border bg-shell p-6 lg:flex">
      {/* Brand Logo */}
      <div className="space-y-8">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md group-hover:scale-105 transition-transform">
            <Gamepad2 className="h-5 w-5 fill-current" aria-hidden="true" />
          </div>
          <span className="font-display text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
            PlayNow
          </span>
        </Link>

        {/* Navigation Items */}
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
      </div>

      {/* Bottom Pro Status Widget */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold">
          <span className="text-muted-foreground">PRO STATUS</span>
          <span className="text-primary">ACTIVE</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-primary" />
        </div>
      </div>
    </aside>
  );
}
