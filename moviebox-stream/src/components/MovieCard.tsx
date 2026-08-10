'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { Movie, getImageUrl } from '@/lib/tmdb';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  isGridItem?: boolean;
}

export default function MovieCard({ movie, onClick, isGridItem = false }: MovieCardProps) {
  const badgeType = movie.language_badge || 'Hindi Dubbed';

  const badgeColor =
    badgeType === 'Web Series'
      ? 'bg-cyan-600/90 border-cyan-400/30'
      : badgeType === 'Hindi Original'
      ? 'bg-emerald-600/90 border-emerald-400/30'
      : 'bg-red-600/90 border-red-400/30';

  const badgeLabel =
    badgeType === 'Web Series'
      ? 'SERIES'
      : badgeType === 'Hindi Original'
      ? 'HINDI'
      : 'HINDI DUB';

  return (
    <Link
      href={`/movie/${movie.id}`}
      onClick={onClick}
      className={`group relative flex flex-col ${
        isGridItem ? 'w-full' : 'w-[135px] min-w-[135px] sm:w-48 flex-shrink-0'
      } bg-gradient-to-b from-neutral-900/80 to-neutral-950/90 rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-red-500/60 active:scale-[0.97] transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/20`}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-900">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-black/80 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex items-center space-x-0.5 sm:space-x-1 border border-white/10 shadow-lg z-10">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-current" />
          <span className="text-[10px] sm:text-[11px] font-bold text-white">
            {movie.vote_average ? movie.vote_average.toFixed(1) : '8.5'}
          </span>
        </div>

        {/* Language / Category Badge */}
        <div className={`absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 ${badgeColor} backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg border shadow-md z-10`}>
          <span className="text-[8px] sm:text-[9px] font-black text-white tracking-wider uppercase">
            {badgeLabel}
          </span>
        </div>

        {/* Hover / Touch Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center space-y-1 sm:space-y-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-300 border border-red-400/40">
            <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-current ml-0.5" />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-white tracking-wide drop-shadow-md">
            Watch Now
          </span>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-2 sm:p-3 flex flex-col flex-1 justify-between bg-neutral-950/40">
        <h3 className="text-xs sm:text-sm font-bold text-neutral-100 truncate group-hover:text-red-400 transition-colors leading-tight">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-400 mt-1.5">
          <span className="font-medium text-neutral-400">
            {movie.release_date ? movie.release_date.substring(0, 4) : '2024'}
          </span>
          <span className="px-1 py-0.5 bg-neutral-800/90 rounded border border-neutral-700/80 text-[9px] sm:text-[10px] text-neutral-300 font-extrabold uppercase">
            HD
          </span>
        </div>
      </div>
    </Link>
  );
}
