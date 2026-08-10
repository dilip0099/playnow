'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Star, Film } from 'lucide-react';
import { Movie, getImageUrl } from '@/lib/tmdb';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Pushpa 2', 'Kalki 2898 AD', 'Spider-Man', 'Stree 2', 'Solo Leveling', 'Mirzapur', 'Deadpool'];

export default function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data.movies || []);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] flex flex-col animate-fade-in md:hidden">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-neutral-800 flex items-center gap-3 bg-[#121212]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies, series, actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-neutral-900 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-sm font-semibold text-neutral-300 hover:text-white px-2 py-1"
        >
          Cancel
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {query.trim().length <= 1 ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Trending Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs text-neutral-200 flex items-center space-x-1.5"
                >
                  <Search className="w-3 h-3 text-red-500" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        ) : isSearching ? (
          <div className="py-12 text-center text-sm text-neutral-400 flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Searching catalog...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Search Results ({results.length})
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {results.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  onClick={onClose}
                  className="flex items-center space-x-3 p-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded-xl active:scale-[0.98] transition-transform"
                >
                  <img
                    src={getImageUrl(movie.poster_path, 'w300')}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{movie.overview}</p>
                    <div className="flex items-center space-x-2 text-[11px] text-neutral-400 mt-1">
                      <span>{movie.release_date?.substring(0, 4) || '2024'}</span>
                      <span>•</span>
                      <span className="text-yellow-400 font-bold">★ {movie.vote_average?.toFixed(1)}</span>
                      <span>•</span>
                      <span className="text-red-400 font-medium">{movie.language_badge || 'Hindi Dubbed'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-neutral-400 space-y-2">
            <Film className="w-10 h-10 text-neutral-600 mx-auto" />
            <p>No results found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
