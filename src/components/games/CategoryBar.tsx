"use client";

import { motion } from "framer-motion";
import { 
  Grid, 
  Swords, 
  Puzzle, 
  Gamepad2, 
  Car, 
  Compass, 
  Brain, 
  Trophy, 
  Users 
} from "lucide-react";
import { GameCategory } from "@/types/game";

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CATEGORIES_WITH_ICONS: { id: string; label: string; icon: any }[] = [
  { id: "all", label: "All Games", icon: Grid },
  { id: "action", label: "Action", icon: Swords },
  { id: "puzzle", label: "Puzzle", icon: Puzzle },
  { id: "arcade", label: "Arcade", icon: Gamepad2 },
  { id: "racing", label: "Racing", icon: Car },
  { id: "adventure", label: "Adventure", icon: Compass },
  { id: "strategy", label: "Strategy", icon: Brain },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "multiplayer", label: "Multiplayer", icon: Users },
];

export function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center space-x-2 min-w-max">
        {CATEGORIES_WITH_ICONS.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex items-center space-x-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                isSelected
                  ? "text-white shadow-lg shadow-purple-500/25"
                  : "border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center space-x-2">
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
