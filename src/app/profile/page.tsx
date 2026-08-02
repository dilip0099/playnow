import { Metadata } from "next";
import Link from "next/link";
import { User, Heart, Clock, Trophy, ShieldCheck, Settings, Play } from "lucide-react";
import { getDefaultUser } from "@/data/users";
import { getAllGames } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "User Profile - GameHub Marketplace",
  description: "Manage player profile, saved favorite games, gameplay stats, and recent play activity.",
};

export default function UserProfilePage() {
  const user = getDefaultUser();
  const allGames = getAllGames();

  const favoriteGames = allGames.filter((g) =>
    user.favorites.some((f) => f.gameId === g.id)
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* User Hero Banner */}
        <Card className="p-8 border-border/60 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-950 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img src={user.avatarUrl} alt={user.username} className="h-24 w-24 rounded-full bg-slate-800 border-2 border-purple-500/40 p-1" />
            
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-3xl font-black text-white">{user.displayName}</h1>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 uppercase text-[10px]">
                  {user.role}
                </Badge>
              </div>
              <p className="text-xs text-purple-400 font-mono">@{user.username}</p>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">{user.bio}</p>
              <p className="text-[11px] text-slate-400 font-semibold">Joined GameHub: {user.joinedDate}</p>
            </div>
          </div>
        </Card>

        {/* Saved Favorites Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <h2 className="text-2xl font-black text-white">Favorite Saved Games</h2>
          </div>

          {favoriteGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-slate-400 text-xs">
              No favorite games saved yet. Click the heart icon on any game card to add it to your collection!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
