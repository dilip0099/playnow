"use client";

import { useState } from "react";
import { Flame, Star } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { GamificationModal } from "./GamificationModal";

export function GamificationBadge() {
  const { streak, level, isLoaded, isDailyRewardAvailable, recentXpNotice } = useGamification();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return null;

  return (
    <>
      <div className="relative flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className={`group flex items-center space-x-1.5 rounded-full border px-2.5 py-1 text-xs font-mono font-bold transition-all hover:scale-105 ${
            isDailyRewardAvailable
              ? "border-primary bg-primary/10 text-primary shadow-glow-primary animate-pulse"
              : "border-border bg-card text-foreground/90 hover:bg-accent"
          }`}
          title="View Player XP, Level & Daily Streak"
        >
          <span className="flex items-center space-x-1 text-orange-400">
            <Flame className="h-3.5 w-3.5 fill-orange-400" />
            <span>{streak}</span>
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center space-x-1 text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" />
            <span>Lvl {level}</span>
          </span>
        </button>

        {/* Floating XP Toast Notice */}
        {recentXpNotice && (
          <div className="absolute top-full mt-2 right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
            <div className="flex items-center space-x-1.5 rounded-xl border border-primary/40 bg-background/95 px-3 py-1.5 text-xs font-mono font-black text-primary shadow-2xl backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-primary animate-spin" />
              <span>+{recentXpNotice.amount} XP</span>
              <span className="text-[10px] text-muted-foreground font-normal">({recentXpNotice.reason})</span>
            </div>
          </div>
        )}
      </div>

      <GamificationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
