"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// `<html suppressHydrationWarning>` in layout.tsx (the officially recommended next-themes pattern)
// already prevents the theme-flash hydration warning, so this doesn't need `ssr: false` — that
// forced the ENTIRE app (every page, not just theme-dependent bits) to render as an empty shell
// until client JS hydrated, which was the direct cause of a ~4.4s LCP "load delay" measured via
// Lighthouse on 2026-08-03.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
