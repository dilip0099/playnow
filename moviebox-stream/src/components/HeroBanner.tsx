'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import { Movie, getImageUrl } from '@/lib/tmdb';

interface HeroBannerProps {
  movie: Movie | null;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
  if (!movie) {
    return (
      <div className="w-full h-[45vh] sm:h-[65vh] bg-neutral-900 animate-pulse rounded-b-3xl" />
    );
  }

  const badgeText = movie.language_badge || 'Hindi Dubbed';

  return (
    <div className="relative w-full h-[52vh] sm:h-[68vh] min-h-[380px] max-h-[700px] flex items-end overflow-hidden mb-4 sm:mb-8">
      {/* Background Poster Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.7]"
        />
        {/* Gradient Overlays for Cinematic Feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/70 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-12 w-full">
        <div className="max-w-2xl space-y-2 sm:space-y-4">
          {/* Release & Rating Tag */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-red-600 font-extrabold text-white uppercase rounded tracking-wider text-[10px] sm:text-[11px] shadow-lg">
              🔥 SPOTLIGHT
            </span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold uppercase rounded text-[10px] sm:text-[11px]">
              🇮🇳 {badgeText}
            </span>
            <div className="flex items-center space-x-1 text-yellow-400 font-bold text-xs sm:text-sm">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '8.6'}</span>
            </div>
            <span className="text-neutral-300 font-medium text-xs sm:text-sm">
              {movie.release_date ? movie.release_date.substring(0, 4) : '2024'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg line-clamp-2">
            {movie.title}
          </h1>

          {/* Overview Synopsis */}
          <p className="text-xs sm:text-base text-neutral-300 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 pt-1 sm:pt-2">
            <Link
              href={`/movie/${movie.id}`}
              className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-base rounded-xl shadow-xl shadow-red-950/40 flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>Watch Hindi Stream</span>
            </Link>

            <Link
              href={`/movie/${movie.id}`}
              className="px-3.5 sm:px-6 py-2.5 sm:py-3 bg-neutral-800/90 hover:bg-neutral-700/90 text-white font-semibold text-xs sm:text-base rounded-xl backdrop-blur-md border border-neutral-700 flex items-center justify-center space-x-1.5 sm:space-x-2 transition active:scale-95"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
