"use client";

import { useState, useRef, useEffect } from "react";
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
  Activity
} from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useFavorites } from "@/hooks/useFavorites";
import { useFullscreen } from "@/hooks/useFullscreen";
import { ShareModal } from "./ShareModal";

interface GamePlayerProps {
  game: GameMetadata;
  onPlay?: () => void;
}

export function GamePlayer({ game, onPlay }: GamePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const favorited = isFavorite(game.id);

  // Live WASD & Arrow Key Listener
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (["W", "A", "S", "D", "ARROWUP", "ARROWLEFT", "ARROWDOWN", "ARROWRIGHT", " "].includes(key)) {
        setActiveKeys((prev) => new Set(prev).add(key === " " ? "SPACE" : key));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (["W", "A", "S", "D", "ARROWUP", "ARROWLEFT", "ARROWDOWN", "ARROWRIGHT", " "].includes(key)) {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(key === " " ? "SPACE" : key);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlaying]);

  const handleStartPlay = () => {
    setIsPlaying(true);
    if (onPlay) onPlay();
  };

  const handleReload = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = game.gameUrl;
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-3xl border border-white/5 bg-[#050505] shadow-2xl transition-all duration-300 ${
          isTheaterMode ? "max-w-none rounded-none border-none shadow-none" : ""
        }`}
      >
        {/* Aspect Ratio Container (16:9) */}
        <div className="relative aspect-[16/9] w-full bg-[#050505]">
          
          {/* Pre-play Cover Overlay */}
          {!isPlaying ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050505]/95 p-6 text-center backdrop-blur-md space-y-4">
              <button
                onClick={handleStartPlay}
                className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110"
              >
                <Play className="h-9 w-9 fill-black ml-1" />
              </button>

              <div className="space-y-1 max-w-md">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Play {game.derivedTitle || game.title}
                </h2>
                <p className="text-xs text-zinc-400">
                  Instant HTML5 execution in your browser. No downloads or installs required.
                </p>
              </div>

              <button
                onClick={handleStartPlay}
                className="rounded-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-8 py-3.5 shadow-xl transition-transform hover:scale-105"
              >
                START GAMEPLAY NOW
              </button>
            </div>
          ) : (
            /* Active Iframe Container */
            <>
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050505]">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-3" />
                  <p className="text-xs font-bold text-zinc-400">Loading HTML5 Game Engine...</p>
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
        <div className="flex items-center justify-between border-t border-white/5 bg-[#121215] px-4 py-3 text-xs">
          
          {/* Left FPS & Live Keypress Indicator Bar */}
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 text-[10px]">
              <Activity className="h-3 w-3 mr-1" />
              <span>60 FPS</span>
            </span>

            {/* Live WASD Keypress Highlights */}
            {isPlaying && (
              <div className="hidden md:flex items-center space-x-1 text-[10px] font-mono font-bold">
                {["W", "A", "S", "D", "SPACE"].map((key) => (
                  <span
                    key={key}
                    className={`px-1.5 py-0.5 rounded border transition-colors ${
                      activeKeys.has(key)
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-zinc-900 text-zinc-500 border-white/5"
                    }`}
                  >
                    {key}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Control Buttons */}
          <div className="flex items-center space-x-2">
            {/* Reload button */}
            {isPlaying && (
              <button
                onClick={handleReload}
                title="Restart Game"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Favorite toggle */}
            <button
              onClick={() => toggleFavorite(game.id)}
              title={favorited ? "Remove from Favorites" : "Add to Favorites"}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 font-bold transition-colors ${
                favorited
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${favorited ? "fill-rose-400 text-rose-400" : ""}`} />
              <span className="hidden sm:inline">{favorited ? "Favorited" : "Favorite"}</span>
            </button>

            {/* Share button */}
            <button
              onClick={() => setIsShareOpen(true)}
              title="Share Game"
              className="flex items-center space-x-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Theater Mode */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              title="Theater Mode"
              className={`flex h-8 w-8 items-center justify-center rounded-xl text-zinc-300 hover:bg-zinc-800 transition-colors ${
                isTheaterMode ? "bg-purple-600 text-white" : "bg-zinc-900"
              }`}
            >
              <Tv className="h-3.5 w-3.5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title="Fullscreen Mode"
              className="flex items-center space-x-1.5 rounded-xl bg-white px-3.5 py-1.5 font-black text-black hover:bg-zinc-200 transition-all"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        game={game}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </>
  );
}
