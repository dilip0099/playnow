import Link from "next/link";
import { Gamepad2, Puzzle, Zap, Trophy, Compass, Flag, ShieldCheck, Flame, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";

const CATEGORY_ITEMS = [
  { slug: "arcade", name: "Arcade", icon: Gamepad2, color: "text-purple-400", count: "12 Games" },
  { slug: "puzzle", name: "Puzzle", icon: Puzzle, color: "text-cyan-400", count: "10 Games" },
  { slug: "action", name: "Action", icon: Zap, color: "text-rose-400", count: "8 Games" },
  { slug: "strategy", name: "Strategy", icon: Compass, color: "text-amber-400", count: "6 Games" },
  { slug: "racing", name: "Racing", icon: Flag, color: "text-emerald-400", count: "5 Games" },
  { slug: "sports", name: "Sports", icon: Trophy, color: "text-indigo-400", count: "5 Games" },
];

export function CategoriesGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
          <Layers className="h-5 w-5 text-purple-400" />
          <span>Browse Game Categories</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORY_ITEMS.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="group">
              <Card className="p-4 border-border/60 bg-card/60 hover:bg-slate-800/80 transition-all duration-300 backdrop-blur-md space-y-2 text-center h-full hover:-translate-y-1">
                <div className={`h-10 w-10 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform ${cat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{cat.name}</h3>
                <span className="text-[10px] font-semibold text-slate-400 block">{cat.count}</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
