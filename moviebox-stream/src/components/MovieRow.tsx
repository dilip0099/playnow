'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '@/lib/tmdb';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  id?: string;
}

export default function MovieRow({ title, movies, id }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [isGrid, setIsGrid] = useState(false);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id={id} className="my-6 sm:my-8 relative px-4 sm:px-6 lg:px-8 group">
      {/* Category Title & View Toggle Bar */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <h2 className="text-base sm:text-2xl font-bold text-white tracking-wide border-l-3 sm:border-l-4 border-red-600 pl-2.5 sm:pl-3 truncate">
            {title}
          </h2>
          <span className="text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 bg-neutral-800/90 text-neutral-400 font-semibold rounded-full border border-neutral-700/60 flex-shrink-0">
            {movies.length}
          </span>
        </div>

        {/* Grid vs Horizontal Row Toggle Button */}
        <button
          onClick={() => setIsGrid(!isGrid)}
          className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-[11px] sm:text-xs font-semibold text-neutral-300 transition-all hover:text-white flex-shrink-0"
        >
          {isGrid ? (
            <>
              <List className="w-3.5 h-3.5 text-red-500" />
              <span>Row</span>
            </>
          ) : (
            <>
              <Grid className="w-3.5 h-3.5 text-red-500" />
              <span>View All</span>
            </>
          )}
        </button>
      </div>

      {/* Grid View Mode */}
      {isGrid ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4 py-2 animate-fade-in">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isGridItem={true} />
          ))}
        </div>
      ) : (
        /* Horizontal Scroll Slider Mode */
        <div className="relative -mx-4 sm:mx-0">
          {/* Left Arrow Button (Desktop only) */}
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-red-600 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-neutral-700 -ml-2"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Movies Container with Touch Pan & Snap Scrolling */}
          <div
            ref={rowRef}
            className="flex items-stretch space-x-3 sm:space-x-4 overflow-x-auto scrollbar-none py-2 px-4 sm:px-1 scroll-smooth snap-x snap-mandatory touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.length > 0
              ? movies.map((movie) => (
                  <div key={movie.id} className="snap-start flex-shrink-0">
                    <MovieCard movie={movie} />
                  </div>
                ))
              : Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-[135px] sm:w-48 aspect-[2/3] bg-neutral-900 rounded-xl animate-pulse"
                  />
                ))}
          </div>

          {/* Right Arrow Button (Desktop only) */}
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-red-600 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-neutral-700 -mr-2"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
