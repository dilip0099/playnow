"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Gamepad2, 
  Search, 
  Dices, 
  Heart, 
  Sparkles,
  X,
  Compass,
  ShieldCheck,
  Code2,
  Lock,
  Menu
} from "lucide-react";
import { gamesData } from "@/lib/games";
import { useFavorites } from "@/hooks/useFavorites";
import { GameMetadata } from "@/types/game";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<GameMetadata[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Main Nav Items */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                GAMEHUB
              </span>
              <span className="text-[10px] font-bold text-cyan-400 -mt-1 tracking-widest uppercase">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Store
            </Link>
            <Link href="/discover" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <Compass className="h-3.5 w-3.5" />
              <span>Discover</span>
            </Link>
            <Link href="/compliance" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Compliance</span>
            </Link>
            <Link href="/developers" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center space-x-1">
              <Code2 className="h-3.5 w-3.5" />
              <span>Publishers</span>
            </Link>
            <Link href="/admin" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center space-x-1">
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
                <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search open games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                  className="w-full rounded-xl border border-border/60 bg-slate-900/80 py-2 pl-9 pr-8 text-xs font-semibold text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Dropdown Search Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border/60 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 space-y-1">
                {searchResults.map((game) => (
                  <Link
                    key={game.id}
                    href={`/game/${game.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center space-x-3 rounded-xl p-2 hover:bg-slate-800 transition-colors"
                  >
                    <img src={game.thumbnailUrl} alt={game.title} className="h-9 w-9 rounded-lg object-cover" />
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-white truncate">{game.derivedTitle || game.title}</span>
                      <span className="text-[10px] text-purple-400 font-semibold capitalize">{game.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Random Game Roll Button */}
          <button
            onClick={handleRandomGame}
            title="Surprise Game"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-border/60 text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-md"
          >
            <Dices className="h-4 w-4" />
          </button>

          {/* Favorites Counter */}
          <Link
            href="/search?favorites=true"
            className="relative flex h-9 items-center space-x-1.5 rounded-xl bg-slate-900 border border-border/60 px-3 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-rose-400 transition-all"
          >
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
            <span className="hidden sm:inline">Favorites</span>
            {mounted && favorites.length > 0 && (
              <Badge className="ml-1 bg-rose-500 text-white font-black text-[10px] px-1.5 py-0.2">
                {favorites.length}
              </Badge>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-border/60 text-slate-300"
          >
            <Menu className="h-5 w-5" />
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-slate-950 p-4 space-y-3 font-bold text-xs">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">
            Store Page
          </Link>
          <Link href="/discover" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-cyan-400">
            Discover Catalog
          </Link>
          <Link href="/compliance" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-emerald-400">
            Legal Compliance
          </Link>
          <Link href="/developers" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-purple-400">
            Developer Publishing
          </Link>
          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-amber-400">
            Admin Executive Suite
          </Link>
        </div>
      )}
    </header>
  );
}
