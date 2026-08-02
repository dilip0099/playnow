import { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowLeft, ShieldCheck, UserCheck, Key } from "lucide-react";
import { MOCK_USERS } from "@/data/users";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "User Management - GameHub Admin",
  description: "User profiles, roles, play activity history, and authentication accounts.",
};

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link href="/admin" className="inline-flex items-center space-x-1 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Admin Overview</span>
        </Link>

        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20 flex items-center space-x-1">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span>Player Accounts Directory</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">User Account Management</h1>
          <p className="text-sm text-slate-400">
            Player profiles, roles, favorite games history, and user activity telemetry.
          </p>
        </div>

        {/* User Accounts Table */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-900/80 text-white font-bold border-b border-border/60 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Favorites Count</th>
                  <th className="px-5 py-4 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {MOCK_USERS.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono">{index + 1}</td>
                    <td className="px-5 py-4 font-bold text-white flex items-center space-x-2">
                      <img src={user.avatarUrl} alt={user.username} className="h-7 w-7 rounded-full bg-slate-800" />
                      <span>{user.displayName}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{user.email}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="font-mono text-[10px] bg-purple-500/10 text-purple-300 border-purple-500/30 uppercase">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 font-bold text-cyan-400">{user.favorites.length} Favorites</td>
                    <td className="px-5 py-4 text-right font-mono text-slate-400">{user.joinedDate}</td>
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
