'use client';

import React, { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import MovieRow from '@/components/MovieRow';
import {
  Movie,
  CastMember,
  getMovieDetails,
  getMovieCredits,
  getMovieRecommendations,
  getImageUrl,
} from '@/lib/tmdb';
import { Star, Calendar, Clock, Play, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import Link from 'next/link';

interface StreamMirror {
  name: string;
  quality: string;
  url: string;
  proxiedUrl: string;
  type: 'hls' | 'mp4';
}

interface StreamResponse {
  success: boolean;
  streamUrl: string;
  rawStreamUrl: string;
  mirrors: StreamMirror[];
  isFallback?: boolean;
}

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [streamData, setStreamData] = useState<StreamResponse | null>(null);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [movieData, castData, recoData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieRecommendations(id),
        ]);

        setMovie(movieData);
        setCast(castData);
        setRecommendations(recoData);

        // Fetch native HLS stream URL from backend stream resolver endpoint
        const streamRes = await fetch(`/api/stream/${id}`);
        const sData: StreamResponse = await streamRes.json();
        setStreamData(sData);
        if (sData.streamUrl) {
          setCurrentStreamUrl(sData.streamUrl);
        }
      } catch (err) {
        console.error('Failed to load movie details/stream:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white pb-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium">Resolving movie metadata & clean stream...</p>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white pb-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold text-white">Movie Metadata Unavailable</h2>
          <p className="text-neutral-400 text-xs text-center">We couldn't retrieve the metadata for this title. Please try returning home.</p>
          <Link href="/" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 font-semibold rounded-xl text-white text-xs">
            Return to Browse
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white pb-24">
      <Navbar />

      {/* Header Back Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Video Player Spotlight (When Playing) */}
        {isPlaying && currentStreamUrl ? (
          <div className="space-y-3 sm:space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-xl font-bold text-white truncate pr-2">
                <span>Now Playing: {movie.title}</span>
              </h2>
              <button
                onClick={() => setIsPlaying(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-lg text-neutral-300 transition flex-shrink-0"
              >
                Close Player
              </button>
            </div>

            {/* Native HLS Ad-Free Video Player */}
            <VideoPlayer
              streamUrl={currentStreamUrl}
              title={movie.title}
              poster={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
              mirrors={streamData?.mirrors || []}
              onMirrorSelect={(mirror) => setCurrentStreamUrl(mirror.proxiedUrl)}
            />
          </div>
        ) : (
          /* Movie Details Header Card */
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 p-4 sm:p-8">
            {/* Backdrop Blur Background */}
            <div className="absolute inset-0 z-0 opacity-20 filter blur-xl">
              <img
                src={getImageUrl(movie.backdrop_path, 'original')}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
              {/* Poster Image */}
              <div className="flex justify-center">
                <div className="relative w-48 sm:w-72 aspect-[2/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-neutral-700">
                  <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-black/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center space-x-1 border border-white/10 text-yellow-400 font-bold text-[11px] sm:text-xs">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                    <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '8.4'}</span>
                  </div>
                </div>
              </div>

              {/* Movie Meta Information */}
              <div className="md:col-span-2 space-y-4 sm:space-y-5">
                <div className="space-y-1 sm:space-y-2">
                  <h1 className="text-2xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xs sm:text-sm italic text-red-400 font-medium">"{movie.tagline}"</p>
                  )}
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300 font-medium">
                  <div className="flex items-center space-x-1 bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-700">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    <span>{movie.release_date || 'N/A'}</span>
                  </div>
                  {movie.runtime && (
                    <div className="flex items-center space-x-1 bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-700">
                      <Clock className="w-3.5 h-3.5 text-red-500" />
                      <span>{movie.runtime} mins</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-[11px]">Native HLS (No Ads)</span>
                  </div>
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {movie.genres.map((g) => (
                      <span
                        key={g.id}
                        className="px-2.5 py-1 bg-neutral-800 rounded-lg text-[11px] font-semibold text-neutral-300 border border-neutral-700 flex items-center space-x-1"
                      >
                        <Tag className="w-3 h-3 text-neutral-400" />
                        <span>{g.name}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Overview
                  </h3>
                  <p className="text-xs sm:text-base text-neutral-300 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* Big Action Play Button */}
                <div className="pt-2 sm:pt-4">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-red-950/50 flex items-center justify-center space-x-3 transition active:scale-95"
                  >
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                    <span>Play Full Movie</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cast & Crew Section */}
        {cast.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base sm:text-xl font-bold text-white border-l-4 border-red-600 pl-3">
              Top Cast
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 sm:gap-3">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-neutral-900/60 rounded-xl p-1.5 sm:p-2 border border-neutral-800 text-center space-y-1.5"
                >
                  <img
                    src={getImageUrl(actor.profile_path, 'w300')}
                    alt={actor.name}
                    className="w-full aspect-square object-cover rounded-lg bg-neutral-800"
                  />
                  <div className="text-[10px] sm:text-xs">
                    <p className="font-semibold text-white truncate">{actor.name}</p>
                    <p className="text-neutral-500 text-[9px] sm:text-[10px] truncate">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations Row */}
        {recommendations.length > 0 && (
          <MovieRow title="More Like This" movies={recommendations} />
        )}
      </div>
    </main>
  );
}
