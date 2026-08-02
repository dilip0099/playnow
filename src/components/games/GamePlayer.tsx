"use client";

import { useState, useRef } from "react";
import { 
  Maximize2, 
  Minimize2, 
  Heart, 
  Share2, 
  Tv, 
  RotateCcw, 
  Loader2, 
  Play, 
  ShieldCheck 
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

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
  const favorited = isFavorite(game.id);

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
        className={`relative w-full overflow-hidden rounded-3xl border border-border/80 bg-slate-950 shadow-2xl transition-all duration-300 ${
          isTheaterMode ? "max-w-none rounded-none border-none shadow-none" : ""
        }`}
      >
        {/* Aspect Ratio Container (16:9 default) */}
        <div className="relative aspect-[16/9] w-full bg-slate-950">
          
          {/* Pre-play Cover Overlay */}
          {!isPlaying ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center backdrop-blur-md">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 shadow-2xl shadow-purple-500/40">
                <Play className="h-9 w-9 fill-white text-white ml-1.5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Ready to play {game.title}?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
                Click below to start playing immediately in high definition. No downloads needed.
              </p>
              <button
                onClick={handleStartPlay}
                className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-500/30 hover:scale-105 transition-all"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>PLAY GAME NOW</span>
              </button>
            </div>
          ) : (
            /* Active Iframe Container */
            <>
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-3" />
                  <p className="text-xs font-semibold text-slate-400">Loading HTML5 Engine...</p>
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
        <div className="flex items-center justify-between border-t border-border/40 bg-slate-900/90 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">HTML5 Safe</span>
            </span>
            <span className="text-xs text-muted-foreground hidden md:inline">
              {game.title}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Reload button */}
            {isPlaying && (
              <button
                onClick={handleReload}
                title="Restart Game"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            {/* Favorite toggle */}
            <button
              onClick={() => toggleFavorite(game.id)}
              title={favorited ? "Remove from Favorites" : "Add to Favorites"}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                favorited
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Heart className={`h-4 w-4 ${favorited ? "fill-pink-400" : ""}`} />
              <span className="hidden sm:inline">{favorited ? "Favorited" : "Favorite"}</span>
            </button>

            {/* Share button */}
            <button
              onClick={() => setIsShareOpen(true)}
              title="Share Game"
              className="flex items-center space-x-1.5 rounded-xl bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Theater Mode */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              title="Theater Mode"
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 hover:bg-slate-700 transition-colors ${
                isTheaterMode ? "bg-purple-600 text-white" : "bg-slate-800/80"
              }`}
            >
              <Tv className="h-4 w-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title="Fullscreen Mode"
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:scale-105 transition-all"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
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
