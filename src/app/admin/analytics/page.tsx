import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { TrendingUp, ArrowLeft, Users, Play, Search, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Platform Analytics - GameHub Admin",
  description: "Play trends, retention metrics, user activity, and popular game rankings.",
};

function loadAnalytics() {
  const analyticsPath = path.join(process.cwd(), "src", "data", "analytics.json");
  let data: any = {};
  try {
    if (fs.existsSync(analyticsPath)) data = JSON.parse(fs.readFileSync(analyticsPath, "utf-8"));
  } catch (e) {}
  return data;
}

export default function AdminAnalyticsPage() {
  const analytics = loadAnalytics();

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link href="/admin" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Admin Overview</span>
        </Link>

        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20 flex items-center space-x-1">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>Platform Telemetry Engine</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">Platform Analytics & Engagement</h1>
          <p className="text-sm text-slate-400">
            Daily play trends, active player retention, search queries, and game performance telemetry.
          </p>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Total Plays</div>
            <div className="text-3xl font-black text-cyan-400">{(analytics.totalPlays || 148500).toLocaleString()}</div>
            <div className="text-xs text-slate-400 font-semibold">Total Views: {(analytics.totalViews || 320900).toLocaleString()}</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Daily Active Users</div>
            <div className="text-3xl font-black text-purple-300">{(analytics.userEngagement?.activeUsersDaily || 4200).toLocaleString()}</div>
            <div className="text-xs text-slate-400 font-semibold">Monthly: {(analytics.userEngagement?.activeUsersMonthly || 89000).toLocaleString()}</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Repeat Play Rate</div>
            <div className="text-3xl font-black text-emerald-400">{analytics.userEngagement?.repeatPlayRatePercentage || 78.4}%</div>
            <div className="text-xs text-emerald-400 font-semibold">High Retention</div>
          </Card>

          <Card className="p-6 border-border/60 bg-card/60 backdrop-blur-md space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase">Avg Session Length</div>
            <div className="text-3xl font-black text-amber-400">{analytics.userEngagement?.averageSessionMinutes || 14.5} Mins</div>
            <div className="text-xs text-slate-400 font-semibold">Desktop & Mobile</div>
          </Card>
        </div>

        {/* Daily Activity Trends Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Daily Play Telemetry (Last 7 Days)</h2>
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-900/80 text-white font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Daily Plays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {analytics.dailyPlays?.map((day: any) => (
                  <tr key={day.date} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono text-white">{day.date}</td>
                    <td className="px-5 py-4 text-right font-bold text-cyan-400 font-mono">{day.plays.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
