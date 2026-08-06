"use client";

import { Flame, Star, Trophy, Sparkles, CheckCircle2, Lock, Gift, Gamepad2, Zap, Crown } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useGamification, ALL_BADGES, Badge } from "@/hooks/useGamification";

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GamificationModal({ isOpen, onClose }: GamificationModalProps) {
  const {
    xp,
    streak,
    level,
    levelProgressPercent,
    xpForNextLevel,
    gamesPlayedCount,
    unlockedBadgeIds,
    isDailyRewardAvailable,
    claimDailyReward,
  } = useGamification();

  const handleClaim = () => {
    claimDailyReward();
  };

  const getRankTitle = (lvl: number) => {
    if (lvl >= 10) return "LEGENDARY APEX";
    if (lvl >= 7) return "MASTER ARCADE";
    if (lvl >= 5) return "PRO PLAYER";
    if (lvl >= 3) return "RISING CHAMPION";
    return "GAMER APPRENTICE";
  };

  const renderBadgeIcon = (iconKey: Badge["iconKey"]) => {
    switch (iconKey) {
      case "gamepad":
        return <Gamepad2 className="h-4 w-4 text-primary" />;
      case "flame":
        return <Flame className="h-4 w-4 text-orange-400 fill-orange-400" />;
      case "zap":
        return <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />;
      case "star":
        return <Star className="h-4 w-4 text-amber-400 fill-amber-400" />;
      case "trophy":
        return <Trophy className="h-4 w-4 text-amber-500 fill-amber-500" />;
      case "crown":
        return <Crown className="h-4 w-4 text-purple-400 fill-purple-400" />;
      default:
        return <Gamepad2 className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title="Player Level & Achievements" className="max-w-md space-y-5">
      {/* Player Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card/80 to-primary/10 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-display font-black text-xl text-primary-foreground shadow-glow-primary">
              {level}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-black text-foreground text-sm tracking-wider uppercase">
                  {getRankTitle(level)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {xp} Total XP • {gamesPlayedCount} Games Played
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-400">
            <Flame className="h-4 w-4 fill-orange-400" />
            <span>{streak} Day Streak</span>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono font-bold text-muted-foreground">
            <span>LEVEL {level}</span>
            <span>{xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 shadow-glow-primary"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Check-in Rewards Section */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-4 w-4 text-primary" />
            <h3 className="font-display text-xs font-black text-foreground uppercase tracking-wider">
              Daily Streak Rewards
            </h3>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">7 Days Cycle</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
            const isCompleted = streak >= day && !isDailyRewardAvailable;
            const isCurrent = streak === day && isDailyRewardAvailable;
            const rewardXp = 50 + (day - 1) * 15;

            return (
              <div
                key={day}
                className={`flex flex-col items-center justify-center rounded-xl p-2 text-center border transition-all ${
                  isCompleted
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : isCurrent
                    ? "border-primary bg-primary text-primary-foreground font-bold animate-pulse"
                    : "border-border bg-muted/50 text-muted-foreground opacity-60"
                }`}
              >
                <span className="text-[10px] font-mono font-bold">D{day}</span>
                <span className="text-xs font-black my-1">+{rewardXp}</span>
                {isCompleted ? (
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
              </div>
            );
          })}
        </div>

        {isDailyRewardAvailable ? (
          <button
            onClick={handleClaim}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-primary py-2.5 text-xs font-black text-primary-foreground shadow-glow-primary transition-all hover:scale-[1.02] hover:bg-primary-hover uppercase tracking-wider"
          >
            <Sparkles className="h-4 w-4" />
            <span>CLAIM TODAY'S XP BONUS</span>
          </button>
        ) : (
          <div className="flex items-center justify-center space-x-1.5 py-1 text-center text-xs font-bold text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>Today's Bonus Claimed! Check back tomorrow.</span>
          </div>
        )}
      </div>

      {/* Badges Collection Section */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h3 className="font-display text-xs font-black text-foreground uppercase tracking-wider">
            Badge Collection ({unlockedBadgeIds.length}/{ALL_BADGES.length})
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`flex items-center space-x-3 rounded-xl border p-2.5 transition-all ${
                  isUnlocked
                    ? "border-primary/30 bg-primary/5 text-foreground"
                    : "border-border bg-muted/30 text-muted-foreground opacity-50"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                  {isUnlocked ? renderBadgeIcon(badge.iconKey) : <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xs font-bold truncate">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
}
