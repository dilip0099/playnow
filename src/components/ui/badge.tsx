import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
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
          "bg-secondary/10 text-violet-300 border border-secondary/30":
            variant === "default",
          "bg-muted text-muted-foreground": variant === "secondary",
          "border border-border text-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
