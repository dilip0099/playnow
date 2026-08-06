export type GameAspectRatio = "16/9" | "3/4" | "9/16" | "square";

export const ASPECT_RATIO_CLASS: Record<GameAspectRatio, string> = {
  "16/9": "aspect-[16/9]",
  "3/4": "aspect-[3/4]",
  "9/16": "aspect-[9/16]",
  square: "aspect-square",
};

export function resolveAspectRatio(value?: string, textContent?: string): GameAspectRatio {
  if (textContent) {
    const lower = textContent.toLowerCase();
    if (
      lower.includes("portrait") ||
      lower.includes("vertical") ||
      lower.includes("hold upright") ||
      lower.includes("upright mode")
    ) {
      return "9/16";
    }
  }
  return value === "3/4" || value === "9/16" || value === "square" ? value : "16/9";
}
