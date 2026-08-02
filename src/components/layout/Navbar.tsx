"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Gamepad2, 
  Search, 
  Dices, 
  Heart, 
  X,
  Compass,
  Code2,
  Lock,
  Menu,
  Bookmark
} from "lucide-react";
import { gamesData } from "@/lib/games";
import { useFavorites } from "@/hooks/useFavorites";
import { GameMetadata } from "@/types/game";

export function Navbar() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<GameMetadata[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#131313]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Main Nav Items */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c3f400] text-[#161e00] shadow-lg group-hover:scale-105 transition-transform">
              <Gamepad2 className="h-5 w-5 fill-[#161e00]" />
            </div>
            <span className="font-display text-base font-black tracking-tight text-white group-hover:text-[#c3f400] transition-colors">
              GAMEHUB
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Store
            </Link>
            <Link href="/discover" className="hover:text-white transition-colors flex items-center space-x-1">
              <Compass className="h-3.5 w-3.5" />
              <span>Discover</span>
            </Link>
            <Link href="/library" className="hover:text-white transition-colors flex items-center space-x-1">
              <Bookmark className="h-3.5 w-3.5" />
              <span>Library</span>
            </Link>
            <Link href="/developers" className="hover:text-white transition-colors flex items-center space-x-1">
              <Code2 className="h-3.5 w-3.5" />
              <span>Publishers</span>
            </Link>
            <Link href="/admin" className="hover:text-white transition-colors flex items-center space-x-1">
              <Lock className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>

        {/* Right Search & Quick Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Search Bar */}
          <div ref={searchRef} className="relative hidden sm:block w-48 md:w-64">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                  className="w-full rounded-lg border border-white/10 bg-[#1c1b1b] py-1.5 pl-8 pr-16 text-xs font-medium text-white placeholder-zinc-500 focus:border-[#c3f400] focus:outline-none transition-all font-mono"
                />
                
                {/* Hotkey Badge */}
                {!searchQuery && (
                  <kbd className="absolute right-2.5 hidden md:inline-flex items-center rounded border border-white/10 bg-[#131313] px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
                    ⌘K
                  </kbd>
                )}

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 text-zinc-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown Search Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-white/10 bg-[#1c1b1b] p-2 shadow-2xl backdrop-blur-xl z-50 space-y-1">
                {searchResults.map((game) => (
                  <Link
                    key={game.id}
                    href={`/game/${game.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center space-x-3 rounded-lg p-2 hover:bg-zinc-800 transition-colors"
                  >
                    <img src={game.thumbnailUrl} alt={game.title} className="h-8 w-12 rounded-md object-cover" />
                    <div className="flex flex-col truncate">
                      <span className="font-display text-xs font-bold text-white truncate">{game.derivedTitle || game.title}</span>
                      <span className="font-mono text-[10px] text-zinc-400 capitalize">{game.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Random Game Roll Button */}
          <button
            onClick={handleRandomGame}
            title="Random Game (Roll Dice)"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c1b1b] border border-white/10 text-zinc-400 hover:bg-[#c3f400] hover:text-[#161e00] transition-all shadow-md"
          >
            <Dices className={`h-4 w-4 ${isSpinning ? "animate-spin text-[#161e00]" : ""}`} />
          </button>

          {/* Favorites Counter */}
          <Link
            href="/search?favorites=true"
            className="relative flex h-8 items-center space-x-1.5 rounded-lg bg-[#1c1b1b] border border-white/10 px-3 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition-all font-mono"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span className="hidden sm:inline">Saved</span>
            {mounted && favorites.length > 0 && (
              <span className="ml-1 rounded-full bg-[#c3f400] text-[#161e00] font-mono font-black text-[9px] px-1.5 py-0.2">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c1b1b] border border-white/10 text-zinc-300"
          >
            <Menu className="h-4 w-4" />
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#131313] p-4 space-y-3 font-bold text-xs">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-white font-display">
            Store
          </Link>
          <Link href="/discover" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-zinc-400 hover:text-white">
            Discover Catalog
          </Link>
          <Link href="/library" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-zinc-400 hover:text-white">
            My Game Library
          </Link>
          <Link href="/developers" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-zinc-400 hover:text-white">
            Publishers
          </Link>
          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-zinc-400 hover:text-white">
            Admin Suite
          </Link>
        </div>
      )}
    </header>
  );
}
