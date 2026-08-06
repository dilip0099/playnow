"use client";

import { useState } from "react";
import { Copy, Check, Share2, Twitter, Facebook } from "lucide-react";
import { GameMetadata } from "@/types/game";
import { Dialog } from "@/components/ui/dialog";

interface ShareModalProps {
  game: GameMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ game, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Play ${game.title} on PlayThorn!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="space-y-5">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/10 text-violet-300">
          <Share2 className="h-4 w-4" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">Share {game.title}</h3>
      </div>

      {/* Copy Link Input */}
      <div className="space-y-2">
        <label htmlFor="share-link-input" className="text-xs font-semibold text-muted-foreground">
          Direct Game Link
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="share-link-input"
            type="text"
            readOnly
            value={currentUrl}
            className="w-full rounded-xl border border-border/60 bg-muted/50 px-3.5 py-2.5 text-xs text-foreground focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex flex-shrink-0 items-center space-x-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-colors hover:bg-primary-hover"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-2 border-t border-border/40 pt-2">
        <label className="text-xs font-semibold text-muted-foreground">Share to Socials</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareOnTwitter}
            className="flex items-center justify-center space-x-2 rounded-xl border border-border/60 bg-muted p-2.5 text-xs font-bold text-foreground transition-colors hover:bg-accent"
          >
            <Twitter className="h-4 w-4" />
            <span>X / Twitter</span>
          </button>
          <button
            onClick={shareOnFacebook}
            className="flex items-center justify-center space-x-2 rounded-xl border border-border/60 bg-muted p-2.5 text-xs font-bold text-foreground transition-colors hover:bg-accent"
          >
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
