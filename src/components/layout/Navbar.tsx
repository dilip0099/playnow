"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Dices,
  Heart,
  X,
  Gamepad2
} from "lucide-react";
import { gamesData } from "@/lib/games";
import { useFavorites } from "@/hooks/useFavorites";
import { GameMetadata } from "@/types/game";
import { PwaInstallButton } from "@/components/pwa/PwaInstallButton";

export function Navbar() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<GameMetadata[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSpinning, setIsSpinning] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global Ctrl + K / Cmd + K Hotkey Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
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
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);

    const randomIndex = Math.floor(Math.random() * gamesData.length);
    const randomGame = gamesData[randomIndex];
    router.push(`/game/${randomGame.slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && searchResults[activeIndex]) {
      router.push(`/game/${searchResults[activeIndex].slug}`);
      setIsSearchOpen(false);
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
      setActiveIndex(-1);
    }
  };

  const activeResult = activeIndex >= 0 ? searchResults[activeIndex] : undefined;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* Mobile-only Brand Logo — Sidebar (which holds the real logo) is hidden below lg */}
        <Link href="/" className="group flex shrink-0 items-center space-x-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <Gamepad2 className="h-4 w-4 fill-current" aria-hidden="true" />
          </div>
          <span className="hidden font-display text-base font-black tracking-tight text-foreground sm:inline">
            PlayNow
          </span>
        </Link>

        {/* Search Input Bar */}
        <div ref={searchRef} className="relative min-w-0 flex-1 lg:max-w-md lg:flex-initial">
          <form onSubmit={handleSearchSubmit} role="search">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="global-search-input" className="sr-only">
                Search games, friends, discussions
              </label>
              <input
                ref={inputRef}
                id="global-search-input"
                type="text"
                placeholder="SEARCH GAMES, FRIENDS, DISCUSSIONS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                role="combobox"
                aria-expanded={isSearchOpen && searchResults.length > 0}
                aria-controls="navbar-search-results"
                aria-autocomplete="list"
                aria-activedescendant={activeResult ? `search-result-${activeResult.id}` : undefined}
                autoComplete="off"
                className="w-full rounded-lg border border-border bg-card py-1.5 pl-9 pr-12 text-[11px] font-mono font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all uppercase tracking-wider"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Autocomplete Search Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div
              id="navbar-search-results"
              role="listbox"
              aria-label="Search results"
              className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl z-50 space-y-1"
            >
              {searchResults.map((game, idx) => (
                <Link
                  key={game.id}
                  id={`search-result-${game.id}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  href={`/game/${game.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className={`flex items-center space-x-3 rounded-lg p-2 transition-colors ${
                    idx === activeIndex ? "bg-accent" : "hover:bg-accent"
                  }`}
                >
                  <Image src={game.thumbnailUrl} alt="" width={48} height={32} className="h-8 w-12 rounded-md object-cover" />
                  <div className="flex flex-col truncate">
                    <span className="font-display text-xs font-bold text-foreground truncate">{game.derivedTitle || game.title}</span>
                    <span className="font-mono text-[10px] text-muted-foreground capitalize">{game.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex shrink-0 items-center space-x-2 sm:space-x-4">
          <PwaInstallButton />

          {/* Random Roll Dice — hidden on mobile to reduce crowding */}
          <button
            onClick={handleRandomGame}
            title="Random Game (Roll Dice)"
            aria-label="Play a random game"
            className="hidden h-8 w-8 items-center justify-center rounded-lg bg-card border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all sm:flex"
          >
            <Dices className={`h-4 w-4 ${isSpinning ? "animate-spin" : ""}`} />
          </button>

          {/* Favorites Badge */}
          <Link
            href="/search?favorites=true"
            aria-label="Saved games"
            className="relative flex h-8 items-center space-x-1.5 rounded-lg bg-card border border-border px-2 text-xs font-mono font-bold text-foreground/80 hover:bg-accent transition-all sm:px-3"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" aria-hidden="true" />
            <span className="hidden sm:inline">Saved</span>
            {mounted && favorites.length > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground font-mono font-black text-[9px] px-1.5 py-0.2">
                {favorites.length}
              </span>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
}
