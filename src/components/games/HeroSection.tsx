"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Sparkles, Star, Flame, Dices, ArrowRight } from "lucide-react";
import { GameMetadata } from "@/types/game";

interface HeroSectionProps {
  featuredGame?: GameMetadata;
}

export function HeroSection({ featuredGame }: HeroSectionProps) {
  if (!featuredGame) return null;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-950 shadow-2xl">
      {/* Background Hero Image with Vignette Glow */}
      <div className="absolute inset-0 z-0">
        <Image
          src={featuredGame.thumbnailUrl}
          alt={featuredGame.title}
          fill
          priority
          className="object-cover opacity-35 scale-105 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:min-h-[380px]">
        <div className="max-w-2xl space-y-4">
          
          {/* Featured Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>FEATURED GAME OF THE WEEK</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black sm:text-4xl md:text-5xl text-white tracking-tight leading-tight drop-shadow-md">
            {featuredGame.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {featuredGame.description}
          </p>

          {/* Meta Tags */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center space-x-1 text-amber-400 font-bold text-sm bg-slate-900/80 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Star className="h-4 w-4 fill-amber-400" />
              <span>{featuredGame.rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center space-x-1 text-cyan-400 font-semibold text-sm bg-slate-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              <Flame className="h-4 w-4 fill-cyan-400" />
              <span>{(featuredGame.playsCount / 1000).toFixed(1)}k Plays</span>
            </div>

            <span className="rounded-lg bg-purple-500/20 px-2.5 py-1 text-xs font-semibold text-purple-300 uppercase tracking-wider border border-purple-500/30">
              {featuredGame.category}
            </span>
          </div>

        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href={`/game/${featuredGame.slug}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              <Play className="h-5 w-5 fill-white" />
              <span>PLAY NOW FREE</span>
            </motion.button>
          </Link>

          <Link href={`/category/${featuredGame.category.toLowerCase()}`}>
            <button className="flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all">
              <span>More {featuredGame.category} Games</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
