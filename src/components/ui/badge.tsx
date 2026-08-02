import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "cyan" | "pink" | "gold";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-purple-500/10 text-purple-400 border border-purple-500/20":
            variant === "default",
          "bg-muted text-muted-foreground": variant === "secondary",
          "border border-border text-foreground": variant === "outline",
          "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30":
            variant === "cyan",
          "bg-pink-500/10 text-pink-400 border border-pink-500/30":
            variant === "pink",
          "bg-amber-500/10 text-amber-400 border border-amber-500/30":
            variant === "gold",
        },
        className
      )}
      {...props}
    />
  );
}
