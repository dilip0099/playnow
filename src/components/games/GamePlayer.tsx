"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Maximize2,
  Minimize2,
  Heart,
  Share2,
  Tv,
  RotateCcw,
  Loader2,
  Play,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useFavorites } from "@/hooks/useFavorites";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { ShareModal } from "./ShareModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ASPECT_RATIO_CLASS, resolveAspectRatio } from "@/lib/aspect-ratio";

interface GamePlayerProps {
  game: GameMetadata;
  onPlay?: () => void;
}

export function GamePlayer({ game, onPlay }: GamePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoverLoaded, setIsCoverLoaded] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Play the game in its real shape — a portrait game (e.g. most "puzzle"/"casual"
  // titles from GamePix) forced into a landscape 16:9 box renders tiny and
  // unplayable. Portrait titles also get a narrower centered column instead of
  // stretching full-width-then-absurdly-tall on wide screens.
  const aspectRatio = resolveAspectRatio(game.aspectRatio);
  const isPortrait = aspectRatio === "3/4";
  const isLandscapeGame = aspectRatio === "16/9";

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef, isLandscapeGame ? "landscape" : undefined);
  const { addRecentlyPlayed } = useRecentlyPlayed();
  const favorited = isFavorite(game.id);
  const coverImage = game.heroImage || game.coverImage || game.thumbnailUrl;

  const handleStartPlay = () => {
    setIsPlaying(true);
    addRecentlyPlayed(game.id);
    if (onPlay) onPlay();
  };

  const handleReload = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = game.gameUrl;
    }
  };

  // Fullscreen overrides everything else: a fixed aspect-ratio box sized off the
  // pre-rotation viewport width is what caused the reported "cut off at the bottom after
  // rotating" bug — e.g. a 16:9 box computed from a 390px-wide portrait phone is ~219px
  // tall, but after rotating to landscape the box stays 219px tall against a now much
  // shorter *screen*, so the toolbar below it gets pushed off-screen. Filling all
  // available space with flex instead of a fixed ratio makes it correct at any rotation.
  const widthClass = isFullscreen
    ? "max-w-none rounded-none border-none shadow-none"
    : isTheaterMode
    ? "max-w-none rounded-none border-none shadow-none"
    : isPortrait
    ? "max-w-xs sm:max-w-sm mx-auto"
    : "";

  return (
    <>
      {/* Rotate hint — only meaningful for landscape games viewed on a narrow portrait
          screen; disappears the instant the device is actually rotated (pure CSS media
          query, no JS orientation listener needed) or the viewport is desktop-sized. */}
      {isLandscapeGame && (
        <div className="mb-3 hidden items-center justify-center space-x-2 rounded-xl border border-border bg-muted px-4 py-2.5 text-xs text-muted-foreground portrait:flex md:!hidden">
          <Smartphone className="h-4 w-4 rotate-90 text-primary" aria-hidden="true" />
          <span>Rotate your device for the best experience</span>
        </div>
      )}

      <div
        ref={containerRef}
        className={`relative flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl transition-all duration-base ${
          isFullscreen ? "h-full" : ""
        } ${widthClass}`}
      >
        {/* Aspect Ratio Container — matches the real game's shape so portrait titles
            aren't squeezed into a landscape box (reserves space up front to avoid layout
            shift); in fullscreen it fills all remaining space instead, since a fixed
            ratio is exactly what breaks on rotation (see note above). */}
        <div className={`relative w-full bg-background ${isFullscreen ? "min-h-0 flex-1" : ASPECT_RATIO_CLASS[aspectRatio]}`}>

          {/* Pre-play Cover Overlay */}
          {!isPlaying ? (
            <>
              {!isCoverLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
              <Image
                src={coverImage}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 100vw, 900px"
                priority
                onLoad={() => setIsCoverLoaded(true)}
                className={`object-cover transition-opacity duration-slow ${
                  isCoverLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />

              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-glow-primary">
                  <Play className="ml-1.5 h-9 w-9 fill-current text-primary-foreground" />
                </div>
                <h2 className="mb-2 font-display text-2xl font-black text-foreground sm:text-3xl">
                  Ready to play {game.title}?
                </h2>
                <p className="mb-6 max-w-md text-xs text-muted-foreground sm:text-sm">
                  Click below to start playing immediately in high definition. No downloads needed.
                </p>
                <button
                  onClick={handleStartPlay}
                  className="flex items-center space-x-2 rounded-full bg-primary px-8 py-3.5 text-sm font-black text-primary-foreground shadow-glow-primary transition-all hover:scale-105 hover:bg-primary-hover"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>PLAY GAME NOW</span>
                </button>
              </div>
            </>
          ) : (
            /* Active Iframe Container */
            <>
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background">
                  <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
                  <p className="text-xs font-semibold text-muted-foreground">Loading HTML5 Engine...</p>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={game.gameUrl}
                title={game.title}
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={() => setIsLoading(false)}
                className="h-full w-full border-0"
              />
            </>
          )}

        </div>

        {/* Toolbar Controls Bar */}
        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">HTML5 Safe</span>
            </span>
            <span className="hidden text-xs text-muted-foreground md:inline">{game.title}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Reload button */}
            {isPlaying && (
              <button
                onClick={handleReload}
                title="Restart Game"
                aria-label="Restart game"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            {/* Favorite toggle */}
            <button
              onClick={() => toggleFavorite(game.id)}
              aria-pressed={favorited}
              title={favorited ? "Remove from Favorites" : "Add to Favorites"}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                favorited
                  ? "border border-rose-500/30 bg-rose-500/20 text-rose-400"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Heart className={`h-4 w-4 ${favorited ? "fill-rose-400" : ""}`} />
              <span className="hidden sm:inline">{favorited ? "Favorited" : "Favorite"}</span>
            </button>

            {/* Share button */}
            <button
              onClick={() => setIsShareOpen(true)}
              title="Share Game"
              className="flex items-center space-x-1.5 rounded-xl bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Theater Mode */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              title="Theater Mode"
              aria-pressed={isTheaterMode}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                isTheaterMode
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Tv className="h-4 w-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title="Fullscreen Mode"
              className="flex items-center space-x-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-glow-primary transition-all hover:scale-105 hover:bg-primary-hover"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal game={game} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
}
