import Link from "next/link";
import { Gamepad2, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 shadow-xl shadow-purple-500/10">
        <Gamepad2 className="h-10 w-10 animate-bounce" />
      </div>

      <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400 border border-pink-500/20 uppercase tracking-wider mb-3">
        404 - GAME NOT FOUND
      </span>

      <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
        Oops! Page Level Lost
      </h1>

      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        The game or category page you are looking for has been moved, removed, or never existed. Return home to discover playable games.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-500/30 hover:scale-105 transition-all"
        >
          <Home className="h-4 w-4" />
          <span>BACK TO HOMEPAGE</span>
        </Link>
      </div>
    </div>
  );
}
