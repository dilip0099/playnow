"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Heart, Star, Flame, Sparkles } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { useFavorites } from "@/hooks/useFavorites";

interface GameCardProps {
  game: GameMetadata;
  priority?: boolean;
}

export function GameCard({ game, priority = false }: GameCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(game.id);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-lg backdrop-blur-md hover:border-purple-500/50 hover:shadow-purple-500/10 transition-all duration-300"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <Image
          src={game.thumbnailUrl}
          alt={game.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="rounded-full bg-slate-950/70 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
            {game.category}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(game.id);
            }}
            title={favorited ? "Remove from Favorites" : "Add to Favorites"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md hover:bg-slate-900 transition-transform active:scale-90"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                favorited ? "fill-pink-500 text-pink-500" : "text-white/70 hover:text-white"
              }`}
            />
          </button>
        </div>

        {/* Play Overlay Button */}
        <Link
          href={`/game/${game.slug}`}
          className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 text-white shadow-xl shadow-purple-500/40"
          >
            <Play className="h-6 w-6 fill-white ml-1" />
          </motion.div>
        </Link>
      </div>

      {/* Card Info Details */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <Link href={`/game/${game.slug}`}>
              <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-purple-400 transition-colors">
                {game.title}
              </h3>
            </Link>
            {game.trending && (
              <span className="flex items-center text-xs text-amber-400 font-semibold flex-shrink-0" title="Trending Game">
                <Flame className="h-3.5 w-3.5 mr-0.5 fill-amber-400" />
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>

        {/* Card Footer Meta */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs font-medium text-muted-foreground">
          <div className="flex items-center space-x-1 text-amber-400 font-semibold">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
          <div>
            <span>{(game.playsCount / 1000).toFixed(1)}k plays</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
