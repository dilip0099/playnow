"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Trophy, Play, Flame } from "lucide-react";
import { gamesData } from "@/lib/games";

export function DailyChallengeCard() {
  if (!gamesData || gamesData.length === 0) return null;

  // Select a deterministic Game of the Day based on the day of the year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const featuredGame = gamesData[dayOfYear % gamesData.length];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-card/90 to-primary/10 p-4 sm:p-5 shadow-xl transition-all hover:border-primary/50">
      {/* Ambient glow effect */}
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Info */}
        <div className="flex items-center space-x-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border shadow-md">
            <Image
              src={featuredGame.thumbnailUrl}
              alt={featuredGame.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-1 left-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1 rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[10px] font-mono font-black text-primary uppercase">
                <Trophy className="h-3 w-3" />
                <span>Daily Challenge • 2X XP</span>
              </span>
            </div>

            <h3 className="mt-1 font-display font-black text-base text-foreground sm:text-lg">
              {featuredGame.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              Launch today's featured challenge to earn +50 XP bonus instantly!
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="flex w-full md:w-auto items-center justify-end shrink-0">
          <Link
            href={`/game/${featuredGame.slug}`}
            className="flex w-full md:w-auto items-center justify-center space-x-2 rounded-2xl bg-primary px-6 py-3 text-xs font-black text-primary-foreground shadow-glow-primary transition-all hover:scale-105 hover:bg-primary-hover"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>PLAY CHALLENGE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
