"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Maximize2,
  Minimize2,
  Heart,
  Share2,
  Tv,
  RotateCcw,
  RotateCw,
  Loader2,
  Play,
  ShieldCheck,
  Smartphone,
  Zap,
  X
} from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useFavorites } from "@/hooks/useFavorites";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useRecentlyPlayed } from "@/hooks/useRecentlyPlayed";
import { useGamification } from "@/hooks/useGamification";
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

  const [overrideAspectRatio, setOverrideAspectRatio] = useState<"16/9" | "3/4" | "9/16" | "square" | null>(null);
  const [isOrientationNoticeDismissed, setIsOrientationNoticeDismissed] = useState(false);

  const aspectRatio = overrideAspectRatio || resolveAspectRatio(game.aspectRatio, `${game.title} ${game.description} ${game.instructions} ${(game.tags || []).join(" ")}`);
  const isPortrait = aspectRatio === "3/4" || aspectRatio === "9/16" || aspectRatio === "square";
  const isLandscapeGame = !isPortrait;

  const toggleOrientation = () => {
    setIsOrientationNoticeDismissed(true);
    setOverrideAspectRatio((prev) => {
      if (prev === "9/16" || prev === "3/4" || (!prev && isPortrait)) return "16/9";
      return "9/16";
    });
  };

  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef, isPortrait ? "portrait" : "landscape");
  const { addRecentlyPlayed } = useRecentlyPlayed();
  const { recordGameSession, addXp } = useGamification();
  const favorited = isFavorite(game.id);
  const coverImage = game.heroImage || game.coverImage || game.thumbnailUrl;

  const [effectiveGameUrl, setEffectiveGameUrl] = useState(game.gameUrl);

  // Smart Game Lifecycle Hooks: Listen to GameDistribution & HTML5 SDK postMessage events
  useEffect(() => {
    if (!isPlaying || typeof window === "undefined") return;

    const handleSdkMessage = (event: MessageEvent) => {
      // Validate string message or object event data from iframe SDKs
      const data = typeof event.data === "string" ? event.data : event.data?.action || event.data?.type || "";

      if (data.includes("SDK_GAME_PAUSE") || data.includes("SDK_AD_STARTED")) {
        setIsAdPlaying(true);
      } else if (data.includes("SDK_GAME_START") || data.includes("SDK_AD_COMPLETE") || data.includes("SDK_AD_DISMISSED")) {
        setIsAdPlaying(false);
      } else if (data.includes("SDK_REWARDED_WATCH_COMPLETE") || data.includes("SDK_REWARD_GRANTED")) {
        setIsAdPlaying(false);
        addXp(50, "Watched Rewarded Ad / Bonus Granted!");
        setRewardToast("🎉 Bonus Granted! +50 XP Earned");
        setTimeout(() => setRewardToast(null), 4000);
      }
    };

    // Tab visibility handling: pause/resume awareness
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab switched away - notify iframe if supported
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage("SDK_GAME_PAUSE", "*");
        }
      } else {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage("SDK_GAME_START", "*");
        }
      }
    };

    window.addEventListener("message", handleSdkMessage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("message", handleSdkMessage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying, addXp]);

  // Dynamically ensure gd_sdk_referrer_url matches current origin
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const currentOrigin = encodeURIComponent(window.location.origin);
        const updated = game.gameUrl.replace(
          /gd_sdk_referrer_url=[^&]+/,
          `gd_sdk_referrer_url=${currentOrigin}`
        );
        setEffectiveGameUrl(updated);
      } catch {
        setEffectiveGameUrl(game.gameUrl);
      }
    }
  }, [game.gameUrl]);

  // Network warming for low-latency iframe startup
  useEffect(() => {
    if (typeof window === "undefined" || !game.gameUrl) return;
    try {
      const urlObj = new URL(game.gameUrl);
      const domain = urlObj.origin;
      
      const preconnect = document.createElement("link");
      preconnect.rel = "preconnect";
      preconnect.href = domain;
      preconnect.crossOrigin = "anonymous";
      
      const dnsPrefetch = document.createElement("link");
      dnsPrefetch.rel = "dns-prefetch";
      dnsPrefetch.href = domain;

      document.head.appendChild(preconnect);
      document.head.appendChild(dnsPrefetch);

      return () => {
        try {
          document.head.removeChild(preconnect);
          document.head.removeChild(dnsPrefetch);
        } catch {
          // Silent fallback
        }
      };
    } catch {
      // Fallback
    }
  }, [game.gameUrl]);

  // Passive XP reward while playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      addXp(15, "Active Gameplay");
    }, 90000);
    return () => clearInterval(interval);
  }, [isPlaying, addXp]);

  const handleStartPlay = () => {
    setIsPlaying(true);
    addRecentlyPlayed(game.id);
    recordGameSession();

    // Feature 2: Send background SDK preload signals to iframe for instant zero-lag ad loading
    setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ action: "gdsdk.preloadAd", type: "rewarded" }), "*");
        } catch {
          // Silent fallback
        }
      }
    }, 1500);

    // Auto fullscreen on mobile for ALL games — portrait locks portrait, landscape locks landscape
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      toggleFullscreen();
    }

    if (onPlay) onPlay();
  };

  const handleReload = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = effectiveGameUrl;
    }
  };

  const widthClass = isFullscreen
    ? "max-w-none rounded-none border-none shadow-none"
    : isTheaterMode
    ? "fixed inset-4 sm:inset-10 z-50 max-w-6xl mx-auto my-auto h-[calc(100vh-5rem)] shadow-2xl border-2 border-primary/50"
    : "w-full";

  // Keyboard shortcuts listener for gaming power-users (F = Fullscreen, T = Theater, R = Reload)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setIsTheaterMode((prev) => !prev);
      } else if ((e.key === "r" || e.key === "R") && isPlaying) {
        e.preventDefault();
        handleReload();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, toggleFullscreen]);

  // Auto-handle screen orientation locking for Portrait & Landscape games on mobile
  useEffect(() => {
    if (!isPlaying || typeof window === "undefined") return;

    const handleOrientationChange = () => {
      if (window.innerWidth < 1024 && screen.orientation && "lock" in screen.orientation) {
        try {
          const targetOrientation = isPortrait ? "portrait-primary" : "landscape";
          (screen.orientation as unknown as { lock: (orientation: string) => Promise<void> })
            .lock(targetOrientation)
            .catch(() => {});
        } catch {
          // Fallback
        }
      }
    };

    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [isPlaying, isPortrait]);

  return (
    <>
      {/* Theater Mode Dimmed Backdrop */}
      {isTheaterMode && (
        <div
          onClick={() => setIsTheaterMode(false)}
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        />
      )}

      <div
        ref={containerRef}
        className={`relative flex w-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-black shadow-2xl transition-all duration-base ${
          isFullscreen ? "h-full" : ""
        } ${widthClass}`}
      >
        {/* Aspect Ratio Container — Fullscreen & Responsive Height */}
        <div
          className={`relative w-full bg-black transition-all duration-300 ${
            isFullscreen
              ? "h-full min-h-0 flex-1"
              : ASPECT_RATIO_CLASS[aspectRatio]
          }`}
        >
          {/* Direct Game Iframe Container — Flexible responsive height for all mobile screen sizes */}

          {/* Pre-play Cover Overlay — Launchpad */}
          {!isPlaying ? (
            <>
              {!isCoverLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
              <Image
                src={coverImage}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 100vw, 1200px"
                priority
                onLoad={() => setIsCoverLoaded(true)}
                className={`object-cover transition-all duration-slow ${
                  isCoverLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                {/* Micro-badge */}
                <div className="mb-3.5 flex items-center space-x-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-[11px] font-bold text-foreground backdrop-blur-md">
                  <Zap className="h-3.5 w-3.5 text-primary fill-primary" />
                  <span>Instant Play • Free Browser Game</span>
                </div>

                <h2 className="mb-1.5 sm:mb-2 font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-md leading-tight max-w-sm sm:max-w-none">
                  {game.title}
                </h2>
                <p className="mb-5 max-w-xs sm:max-w-md text-xs sm:text-sm text-white/90 font-medium line-clamp-2">
                  Click below to load game engine directly in your browser.
                </p>

                <button
                  onClick={handleStartPlay}
                  className="flex items-center space-x-2.5 rounded-full bg-primary px-8 py-3.5 text-xs sm:text-sm font-black text-primary-foreground shadow-glow-primary transition-all duration-200 hover:scale-105 hover:bg-primary-hover active:scale-95 uppercase tracking-wider"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>PLAY NOW</span>
                </button>
              </div>
            </>
          ) : (
            /* Active Iframe Container */
            <>
              {/* Active Rewarded Toast Notification */}
              {rewardToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-2 rounded-full bg-emerald-500/90 px-4 py-2 text-xs font-black text-white shadow-xl backdrop-blur-md animate-in slide-in-from-top duration-300">
                  <span>{rewardToast}</span>
                </div>
              )}

              {/* Ad Break Indicator Banner */}
              {isAdPlaying && (
                <div className="absolute top-4 right-4 z-40 flex items-center space-x-2 rounded-full bg-amber-500/90 px-3 py-1.5 text-[11px] font-bold text-black shadow-lg backdrop-blur-md animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-black animate-ping" />
                  <span>Ad Break Active</span>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="mt-4 font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">Loading Game Engine...</p>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={effectiveGameUrl}
                title={game.title}
                allow="autoplay; fullscreen; microphone; camera; midi; geolocation; accelerometer; gyroscope; payment; clipboard-read; clipboard-write"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-pointer-lock allow-downloads"
                onLoad={() => setIsLoading(false)}
                className="h-full w-full border-0 bg-black"
              />
            </>
          )}

        </div>

        {/* PlayThorn Modern Control Bar */}
        <div className="flex items-center justify-between border-t border-border bg-card px-3 py-2.5 sm:px-5 sm:py-3">
          {/* Left: Security Badge, Auto-Save & Title */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="flex items-center space-x-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">HTML5 Verified</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
              <span>☁️ Progress Auto-Saved</span>
            </span>
            <span className="hidden font-display text-xs font-bold text-foreground/80 lg:inline truncate max-w-[180px]">
              {game.title}
            </span>
          </div>

          {/* Right: Control Buttons matching site theme */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Flip Aspect Ratio button */}
            {isPlaying && (
              <button
                onClick={toggleOrientation}
                title={`Switch Aspect Ratio (Currently ${isPortrait ? "Portrait 3:4" : "Landscape 16:9"})`}
                aria-label="Toggle aspect ratio"
                className={`flex h-9 items-center space-x-1 rounded-xl border px-2.5 text-xs font-bold transition-all active:scale-95 ${
                  overrideAspectRatio
                    ? "border-primary/50 bg-primary/20 text-primary"
                    : "border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span className="text-[11px] hidden xs:inline">{isPortrait ? "Vertical 3:4" : "Wide 16:9"}</span>
              </button>
            )}

            {/* Reload button */}
            {isPlaying && (
              <button
                onClick={handleReload}
                title="Restart Game (Press R)"
                aria-label="Restart game"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            {/* Favorite toggle */}
            <button
              onClick={() => toggleFavorite(game.id)}
              aria-pressed={favorited}
              title={favorited ? "Remove from Favorites" : "Add to Favorites"}
              className={`flex h-9 items-center space-x-1.5 rounded-xl border px-3 text-xs font-bold transition-all active:scale-95 ${
                favorited
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                  : "border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Heart className={`h-4 w-4 ${favorited ? "fill-rose-400 text-rose-400" : ""}`} />
              <span className="hidden sm:inline">{favorited ? "Saved" : "Save"}</span>
            </button>

            {/* Share button */}
            <button
              onClick={() => setIsShareOpen(true)}
              title="Share Game"
              className="flex h-9 items-center space-x-1.5 rounded-xl border border-border bg-muted px-3 text-xs font-bold text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Theater Mode */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              title="Theater Mode (Press T)"
              aria-pressed={isTheaterMode}
              className={`hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                isTheaterMode
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Tv className="h-4 w-4" />
            </button>

            {/* Fullscreen Button — Icon Only */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen (Press F)" : "Fullscreen Mode (Press F)"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow-primary transition-all hover:bg-primary-hover active:scale-95"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal game={game} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
}
