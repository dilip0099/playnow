"use client";

import { useEffect, useRef } from "react";
import { Video } from "lucide-react";

interface GameWalkthroughProps {
  externalGameId?: string;
  gameTitle: string;
}

declare global {
  interface Window {
    VIDEO_OPTIONS?: {
      gameid: string;
      width: string;
      height: string;
      color: string;
      getads: string;
    };
  }
}

export function GameWalkthrough({ externalGameId, gameTitle }: GameWalkthroughProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!externalGameId || !containerRef.current) return;

    // Clear previous elements if re-rendered
    containerRef.current.innerHTML = "";

    // Create target div required by GameMonetize script
    const targetDiv = document.createElement("div");
    targetDiv.id = "gamemonetize-video";
    containerRef.current.appendChild(targetDiv);

    // Configure GameMonetize global video options
    window.VIDEO_OPTIONS = {
      gameid: externalGameId,
      width: "100%",
      height: "480px",
      color: "#c3f400", // PlayNow theme lime color
      getads: "true",   // Enable video ads for 80% pub revenue share
    };

    // Inject official GameMonetize video API script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://api.gamemonetize.com/video.js";
    script.id = "gamemonetize-video-api";
    script.async = true;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [externalGameId]);

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

      {/* Container where GameMonetize script initializes #gamemonetize-video */}
      <div className="relative w-full overflow-hidden rounded-xl bg-black border border-border min-h-[320px] sm:min-h-[480px]">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Stuck on a level? Watch the complete video walkthrough for {gameTitle} above to discover tips, secrets, and solutions.
      </p>
    </div>
  );
}
