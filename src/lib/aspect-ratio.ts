export type GameAspectRatio = "16/9" | "3/4" | "square";

export const ASPECT_RATIO_CLASS: Record<GameAspectRatio, string> = {
  "16/9": "aspect-[16/9]",
  "3/4": "aspect-[3/4]",
  square: "aspect-square",
};

export function resolveAspectRatio(value?: string): GameAspectRatio {
  return value === "3/4" || value === "square" ? value : "16/9";
}
