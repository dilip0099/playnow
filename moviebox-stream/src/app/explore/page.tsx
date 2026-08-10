'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { ALL_GENRES, Movie, discoverMovies } from '@/lib/tmdb';
import { Filter, SlidersHorizontal, Loader2, Sparkles } from 'lucide-react';

export default function ExplorePage() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc'>('popularity.desc');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const providers = [
    { id: 8, name: 'Netflix', color: 'border-red-600 bg-red-600/10 text-red-500' },
    { id: 119, name: 'Prime Video', color: 'border-amber-500 bg-amber-500/10 text-amber-400' },
    { id: 122, name: 'Hotstar', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
  ];

  useEffect(() => {
    async function loadExploreData() {
      setLoading(true);
      const data = await discoverMovies({
        genreId: selectedGenre || undefined,
        providerId: selectedProvider || undefined,
        sortBy: sortBy,
        page: page,
      });

      setMovies(data.movies);
      setTotalPages(data.totalPages);
      setLoading(false);
    }

    loadExploreData();
  }, [selectedGenre, selectedProvider, sortBy, page]);

  const handleGenreToggle = (id: number) => {
    setSelectedGenre((prev) => (prev === id ? null : id));
    setPage(1);
  };

  const handleProviderToggle = (id: number) => {
    setSelectedProvider((prev) => (prev === id ? null : id));
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4 sm:pb-6">
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse flex-shrink-0" />
              <h1 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight">
                Explore Categories & Genres
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Browse thousands of movies & series filtered by genres & OTT platforms
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2.5 bg-neutral-900 px-3.5 py-2 rounded-xl border border-neutral-800 self-start sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <span className="text-xs text-neutral-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="popularity.desc" className="bg-neutral-900">🔥 Most Popular</option>
              <option value="vote_average.desc" className="bg-neutral-900">⭐ Top Rated</option>
              <option value="primary_release_date.desc" className="bg-neutral-900">📅 Fresh Releases</option>
            </select>
          </div>
        </div>

        {/* OTT Provider Filters */}
        <div className="space-y-2.5">
          <h3 className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-red-500" />
            <span>Filter by OTT Platform</span>
          </h3>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {providers.map((p) => {
              const isSelected = selectedProvider === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleProviderToggle(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 active:scale-95 ${
                    isSelected
                      ? `${p.color} border-current shadow-lg scale-105`
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Genre Pills Explorer */}
        <div className="space-y-2.5">
          <h3 className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider">
            All Genres ({ALL_GENRES.length})
          </h3>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 snap-x touch-pan-x">
            <button
              onClick={() => {
                setSelectedGenre(null);
                setPage(1);
              }}
              className={`snap-start px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 active:scale-95 ${
                selectedGenre === null
                  ? 'bg-red-600 text-white border-red-500 shadow-lg font-black'
                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              All Genres
            </button>
            {ALL_GENRES.map((genre) => {
              const isSelected = selectedGenre === genre.id;
              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`snap-start px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 active:scale-95 ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-lg font-black'
                      : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
            <p className="text-xs sm:text-sm text-neutral-400 animate-pulse">Loading catalog...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4 pt-2">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isGridItem={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-3">
            <p className="text-base sm:text-lg font-bold text-neutral-300">No movies found matching these filters</p>
            <p className="text-xs text-neutral-500">Try resetting your genre or OTT platform filters.</p>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && movies.length > 0 && (
          <div className="flex items-center justify-center space-x-3 pt-8 sm:pt-12 border-t border-neutral-900">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>
            <span className="text-xs font-bold text-neutral-400">
              Page <span className="text-white">{page}</span> of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
