"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { 
  Gamepad2, 
  Search, 
  Dices, 
  Heart, 
  Sun, 
  Moon, 
  Sparkles,
  X,
  Flame,
  Grid,
  ChevronDown
} from "lucide-react";
import { gamesData } from "@/lib/games";
import { useFavorites } from "@/hooks/useFavorites";
import { GameMetadata } from "@/types/game";

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<GameMetadata[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const filtered = gamesData.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
      setSearchResults(filtered.slice(0, 5));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRandomGame = () => {
    if (gamesData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * gamesData.length);
    const game = gamesData[randomIndex];
    router.push(`/game/${game.slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-2 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gradient-purple-cyan">
              GAMEHUB
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground -mt-1">
              Browser Games
            </span>
          </div>
        </Link>

        {/* Live Instant Search Bar */}
        <div ref={searchRef} className="relative hidden md:block w-72 lg:w-96">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search games, tags, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
              className="w-full rounded-full border border-border/60 bg-muted/50 py-2 pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-purple-500 focus:bg-background focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Search Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Instant Results
              </div>
              <div className="space-y-1">
                {searchResults.map((game) => (
                  <Link
                    key={game.id}
                    href={`/game/${game.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center space-x-3 rounded-xl p-2 hover:bg-purple-500/10 transition-colors"
                  >
                    <div className="relative h-10 w-16 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                      <Image
                        src={game.thumbnailUrl}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="truncate text-sm font-semibold text-foreground">
                        {game.title}
                      </h4>
                      <p className="truncate text-xs text-muted-foreground capitalize">
                        {game.category} • ★ {game.rating.toFixed(1)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Random Game Launcher */}
          <button
            onClick={handleRandomGame}
            title="Surprise me with a random game!"
            className="flex items-center space-x-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-bold text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/60 transition-all hover:scale-105"
          >
            <Dices className="h-4 w-4 animate-spin-slow" />
            <span className="hidden sm:inline">Random Game</span>
          </button>

          {/* Favorites Link */}
          <Link
            href="/search?category=all&favorites=true"
            title="My Favorites"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-muted/50 text-foreground hover:bg-muted transition-colors"
          >
            <Heart className="h-4 w-4 text-pink-500 fill-pink-500/20" />
            {mounted && favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle Theme"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-muted/50 text-foreground hover:bg-muted transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
