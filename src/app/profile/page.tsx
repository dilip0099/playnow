import Link from "next/link";
import {
  User,
  Trophy,
} from "lucide-react";
import { gamesData } from "@/lib/games";

export default function ProfilePage() {
  const recentGames = gamesData.slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

        {/* User Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground font-bold text-2xl shadow-xl">
                <User className="h-10 w-10" aria-hidden="true" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tight">
                    ALEX "NEONCLOUD" V.
                  </h1>
                  <span className="rounded bg-secondary px-2.5 py-0.5 font-mono text-[10px] font-bold text-secondary-foreground uppercase">
                    PRO MEMBER
                  </span>
                </div>

                <p className="text-xs text-muted-foreground max-w-lg font-sans">
                  Apex Predator. Competitive FPS enthusiast. Breaking cloud limits since 2021. Always looking for a high-ping challenge.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 font-mono">
              <div className="rounded-xl border border-border bg-background p-3 text-center min-w-[70px]">
                <span className="text-[9px] text-muted-foreground block">LEVEL</span>
                <span className="text-lg font-black text-primary">84</span>
              </div>
              <button className="btn-primary-lime px-6 py-3 text-xs font-black uppercase">
                FOLLOWING
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Player Performance & Friends */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left Main (70%) */}
          <div className="space-y-8 lg:col-span-2">

            {/* PLAYER PERFORMANCE ROW */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 font-mono">
                <span className="text-xs font-bold text-muted-foreground">PLAYER PERFORMANCE</span>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs text-muted-foreground">GAMES OWNED</span>
                    <span className="text-xl font-black text-primary">124</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs text-muted-foreground">TROPHIES EARNED</span>
                    <span className="text-xl font-black text-violet-300">1,482</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">TOTAL PLAYTIME</span>
                    <span className="text-xl font-black text-foreground">4.2k HRS</span>
                  </div>
                </div>
              </div>

              {/* RECENTLY PLAYED */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-muted-foreground">RECENTLY PLAYED</span>
                  <Link href="/library" className="text-primary text-[10px] font-bold">VIEW ALL</Link>
                </div>

                <div className="space-y-3">
                  {recentGames.map((g) => (
                    <div key={g.id} className="flex items-center space-x-3 rounded-xl bg-muted p-2">
                      <img src={g.thumbnailUrl} alt={g.title} className="h-10 w-14 rounded-lg object-cover" />
                      <div className="truncate space-y-0.5">
                        <h4 className="font-display text-xs font-bold text-foreground truncate">{g.derivedTitle || g.title}</h4>
                        <span className="text-[9px] text-muted-foreground block">LAST PLAYED: YESTERDAY</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECENT ACHIEVEMENTS */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 font-mono">
              <span className="text-xs font-bold text-muted-foreground">RECENT ACHIEVEMENTS</span>

              <div className="space-y-3">
                {[
                  { name: "God of War", desc: "Win 50 consecutive matches without dying.", tag: "ULTRA RARE" },
                  { name: "Diamond Hands", desc: "Accumulate 1,000,000 in-game credits.", tag: "RARE" },
                  { name: "Light Speed", desc: "Complete the tutorial in under 3 minutes.", tag: "COMMON" },
                ].map((ach) => (
                  <div key={ach.name} className="flex items-center justify-between rounded-xl bg-muted p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Trophy className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-display text-xs font-bold text-foreground">{ach.name}</h4>
                        <p className="text-[10px] text-muted-foreground">{ach.desc}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {ach.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (30%): Friends Online & Privacy */}
          <div className="space-y-6 font-mono">

            {/* Friends Online */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-muted-foreground">FRIENDS ONLINE (12)</span>
                <span className="h-2 w-2 rounded-full bg-primary" />
              </div>

              <div className="space-y-3 text-xs">
                {["Ghost_Rider_99", "PixelVanguard", "Luna_Zero"].map((friend) => (
                  <div key={friend} className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-foreground font-bold">{friend}</span>
                    <span className="text-[9px] text-primary">PLAYING NOW</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Dashboard */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-xs">
              <span className="font-bold text-muted-foreground block">PRIVACY DASHBOARD</span>

              <div className="space-y-3 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/80">Online Status</span>
                  <span className="text-primary font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/80">Profile Visibility</span>
                  <span className="text-primary font-bold">PUBLIC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/80">Game Details</span>
                  <span className="text-muted-foreground">FRIENDS ONLY</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
