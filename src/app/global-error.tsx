"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-black text-rose-500">Global Application Error</h1>
          <p className="text-sm text-slate-400">
            A critical error occurred in the root layout. Please refresh or try again.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg"
          >
            Reset Application State
          </button>
        </div>
      </body>
    </html>
  );
}
