export const DESIGN_TOKENS = {
  colors: {
    background: "#090d16", // Deep Obsidian Black
    surface: "#0e1424",    // Slate Card Surface
    surfaceHover: "#151e36",
    surfaceBorder: "rgba(255, 255, 255, 0.08)",
    primary: {
      main: "#7c3aed",     // Royal Violet Primary
      hover: "#6d28d9",
      light: "#a78bfa",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
    },
    secondary: {
      main: "#06b6d4",     // Electric Cyan Highlight
      gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    },
    accent: {
      emerald: "#10b981",  // Verified Badge / Commercial Ready
      amber: "#f59e0b",    // Star Ratings / Warning
      rose: "#f43f5e",     // Hot / Trending
      purple: "#8b5cf6",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
      muted: "#64748b",
    },
  },
  borderRadius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },
  boxShadow: {
    card: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
    glow: "0 0 25px -5px rgba(124, 58, 237, 0.4)",
    cyanGlow: "0 0 25px -5px rgba(6, 182, 212, 0.4)",
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
