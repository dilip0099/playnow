"use client";

import { Video } from "lucide-react";

interface GameWalkthroughProps {
  externalGameId?: string;
  gameTitle: string;
}

export function GameWalkthrough({ externalGameId, gameTitle }: GameWalkthroughProps) {
  if (!externalGameId) return null;

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h3 className="font-display text-sm sm:text-lg font-black uppercase text-foreground flex items-center space-x-2">
          <Video className="h-5 w-5 text-primary" />
          <span>GAMEPLAY WALKTHROUGH & GUIDE</span>
        </h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-primary border border-primary/20">
          Official Guide
        </span>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-border">
        <iframe
          src={`https://html5.gamemonetize.co/walkthrough/${externalGameId}/`}
          title={`${gameTitle} Video Walkthrough`}
          allow="autoplay; fullscreen"
          className="h-full w-full border-0"
        />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Stuck on a level? Watch the complete video walkthrough for {gameTitle} above to discover tips, secrets, and solutions.
      </p>
    </div>
  );
}
