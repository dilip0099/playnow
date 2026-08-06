import Link from "next/link";
import { WifiOff, RefreshCw, Gamepad2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "You are Offline - PlayThorn Games",
  description: "It looks like you've lost your internet connection. Reconnect to resume playing 180+ free games.",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 text-primary shadow-glow-primary">
        <WifiOff className="h-10 w-10" />
      </div>

      <h1 className="mt-6 font-display text-3xl font-black text-foreground sm:text-4xl">
        You are Offline
      </h1>

      <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
        Your internet connection seems to be disconnected. Please check your network and try again to load games.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="flex items-center space-x-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-primary-foreground shadow-glow-primary transition-transform hover:scale-105"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Reconnecting</span>
        </Link>
        <Link
          href="/favorites"
          className="flex items-center space-x-2 rounded-2xl border border-border bg-muted px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-accent"
        >
          <Gamepad2 className="h-4 w-4" />
          <span>Check Saved Games</span>
        </Link>
      </div>
    </div>
  );
}
