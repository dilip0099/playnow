import { Keyboard } from "lucide-react";
import { GameControl } from "@/types/game";

interface GameControlsProps {
  controls: GameControl[];
}

export function GameControls({ controls }: GameControlsProps) {
  if (!controls || controls.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
          <Keyboard className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Game Controls
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {controls.map((ctrl, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/40 px-3.5 py-2.5"
          >
            <span className="text-xs text-muted-foreground font-medium">
              {ctrl.action}
            </span>
            <kbd className="inline-flex items-center justify-center rounded-lg border border-purple-500/30 bg-slate-900 px-2.5 py-1 text-xs font-mono font-bold text-purple-300 shadow-sm">
              {ctrl.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
