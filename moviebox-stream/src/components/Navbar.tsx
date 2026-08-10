'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Film, Tv, Flame, Sparkles, X, Grid } from 'lucide-react';
import { Movie, getImageUrl } from '@/lib/tmdb';
import MobileBottomNav from './MobileBottomNav';
import MobileSearchModal from './MobileSearchModal';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Debounced desktop search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(data.movies || []);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-neutral-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-white tracking-wider leading-none">
                MOVIE<span className="text-red-500">BOX</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium tracking-widest uppercase mt-0.5">
                Stream Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-semibold text-neutral-200 hover:text-red-500 transition flex items-center space-x-1.5"
            >
              <Flame className="w-4 h-4 text-red-500" />
              <span>Home</span>
            </Link>
            <Link
              href="/explore"
              className="text-sm font-semibold text-neutral-300 hover:text-red-500 transition flex items-center space-x-1.5 bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-red-500/50"
            >
              <Grid className="w-4 h-4 text-red-500" />
              <span>Categories & Genres</span>
            </Link>
            <Link
              href="/#tv"
              className="text-sm font-semibold text-neutral-400 hover:text-white transition flex items-center space-x-1.5"
            >
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>Web Series</span>
            </Link>
            <Link
              href="/#toprated"
              className="text-sm font-semibold text-neutral-400 hover:text-white transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Top Rated</span>
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden sm:block relative flex-1 max-w-xs md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search movies, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
                className="w-full pl-10 pr-9 py-2 bg-neutral-900/90 border border-neutral-800 rounded-full text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/80 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-12 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-neutral-400 flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-neutral-800/60">
                    {searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-3 p-3 hover:bg-neutral-800/60 transition group"
                      >
                        <img
                          src={getImageUrl(movie.poster_path, 'w300')}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded-lg shadow group-hover:scale-105 transition-transform"
                        />
                        <div className="flex flex-col flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate group-hover:text-red-500 transition">
                            {movie.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-neutral-400 mt-0.5">
                            <span>{movie.release_date?.substring(0, 4) || 'N/A'}</span>
                            <span>•</span>
                            <span className="text-yellow-400 font-semibold">★ {movie.vote_average?.toFixed(1)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-neutral-400">
                    No movies found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Top Header Right Actions */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-2 bg-neutral-900 rounded-xl border border-neutral-800 text-neutral-300 hover:text-white"
              aria-label="Open Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/explore"
              className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 rounded-xl text-xs font-bold text-white flex items-center space-x-1"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Explore</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Native Mobile Bottom Tab Navigation */}
      <MobileBottomNav onOpenSearch={() => setIsMobileSearchOpen(true)} />

      {/* Full-Screen Mobile Search Overlay */}
      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
}
