"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { GameMetadata } from "@/types/game";

interface GameGalleryProps {
  game: GameMetadata;
}

export function GameGallery({ game }: GameGalleryProps) {
  // Collect all potential image sources
  const rawList = [
    ...(game.screenshots || []),
    game.coverImage,
    game.heroImage,
    game.thumbnailUrl,
  ].filter((src): src is string => typeof src === "string" && src.trim().length > 0);

  // Strict deduplication by exact URL
  const uniqueImages: string[] = [];
  const seenUrls = new Set<string>();

  for (const url of rawList) {
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      uniqueImages.push(url);
    }
  }

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (uniqueImages.length === 0) return null;

  const handleNext = () => {
    if (activeIdx === null) return;
    setActiveIdx((prev) => (prev !== null ? (prev + 1) % uniqueImages.length : 0));
  };

  const handlePrev = () => {
    if (activeIdx === null) return;
    setActiveIdx((prev) => (prev !== null ? (prev - 1 + uniqueImages.length) % uniqueImages.length : 0));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-black text-foreground uppercase tracking-wider flex items-center">
          <span className="w-1 h-3.5 bg-primary rounded-full mr-2" />
          <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-primary" aria-hidden="true" />
          GAME SCREENSHOTS
        </h2>
        <span className="font-mono text-[10px] text-muted-foreground">
          {uniqueImages.length} {uniqueImages.length === 1 ? "Image" : "Images"}
        </span>
      </div>

      {/* Single-line horizontal scrollable row of compact thumbnail cards for mobile & desktop */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none -mx-1 px-1">
        {uniqueImages.map((imgUrl, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            aria-label={`View screenshot ${idx + 1}`}
            className="group relative h-14 w-24 sm:h-16 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Image
              src={imgUrl}
              alt={`${game.title} screenshot ${idx + 1}`}
              fill
              sizes="112px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25 flex items-center justify-center">
              <Maximize2 className="h-3.5 w-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
            </div>
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal on Thumbnail Click */}
      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveIdx(null)}
        >
          <div
            className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={uniqueImages[activeIdx]}
              alt={`${game.title} screenshot preview`}
              fill
              sizes="1200px"
              priority
              className="object-contain"
            />

            <button
              onClick={() => setActiveIdx(null)}
              aria-label="Close image modal"
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md transition-all hover:bg-background"
            >
              <X className="h-5 w-5" />
            </button>

            {uniqueImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous screenshot"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md transition-all hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next screenshot"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md transition-all hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 left-3 rounded-md bg-background/80 px-2.5 py-1 font-mono text-[11px] text-foreground backdrop-blur-md">
              {activeIdx + 1} / {uniqueImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
