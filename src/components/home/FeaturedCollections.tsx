import Link from "next/link";
import { Sparkles, Gamepad2, Puzzle, Trophy, ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    title: "Best Arcade Games",
    subtitle: "High octane action & retro classics",
    href: "/category/arcade",
    icon: Gamepad2,
    gradient: "from-purple-900/60 to-zinc-950",
    border: "border-purple-500/20",
  },
  {
    title: "Best Puzzle Games",
    subtitle: "Challenge your mind & strategy",
    href: "/category/puzzle",
    icon: Puzzle,
    gradient: "from-blue-900/60 to-zinc-950",
    border: "border-blue-500/20",
  },
  {
    title: "Hidden Gems",
    subtitle: "Undiscovered community favorites",
    href: "/discover?sort=rating",
    icon: Sparkles,
    gradient: "from-emerald-900/60 to-zinc-950",
    border: "border-emerald-500/20",
  },
];

export function FeaturedCollections() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Featured Collections</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLLECTIONS.map((col) => {
          const Icon = col.icon;
          return (
            <Link key={col.title} href={col.href} className="group">
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${col.gradient} p-6 border ${col.border} transition-all duration-300 hover:-translate-y-1 hover:border-white/30 space-y-4`}>
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                    <span>{col.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-zinc-400">{col.subtitle}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
