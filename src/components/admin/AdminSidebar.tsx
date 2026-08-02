"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Gamepad2, 
  Users, 
  Code2, 
  TrendingUp, 
  ShieldCheck, 
  Lock,
  ArrowLeft
} from "lucide-react";

const ADMIN_LINKS = [
  { href: "/admin", label: "Executive Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Game Catalog CMS", icon: Gamepad2 },
  { href: "/admin/users", label: "User Accounts", icon: Users },
  { href: "/admin/developers", label: "Developer Queue", icon: Code2 },
  { href: "/admin/analytics", label: "Platform Analytics", icon: TrendingUp },
  { href: "/admin/legal", label: "Legal & Provenance Audit", icon: ShieldCheck },
  { href: "/admin/compliance", label: "Compliance Telemetry", icon: Lock },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/60 bg-slate-950/90 p-4 space-y-6 shrink-0 hidden md:block min-h-[calc(100vh-4rem)]">
      
      <div className="space-y-1">
        <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-4 px-3">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Admin to Store</span>
        </Link>
        <div className="px-3 text-[10px] font-black text-purple-400 uppercase tracking-wider">
          SaaS Control Panel
        </div>
      </div>

      <nav className="space-y-1 text-xs font-bold">
        {ADMIN_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
