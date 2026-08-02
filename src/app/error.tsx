"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Router caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="h-16 w-16 rounded-3xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xl">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">Something Went Wrong</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred while rendering this page. Our automated engine has logged the event.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={() => reset()}
          className="rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 text-xs flex items-center space-x-1.5"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>

        <Link href="/">
          <Button variant="outline" className="rounded-xl font-bold px-5 text-xs flex items-center space-x-1.5">
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
