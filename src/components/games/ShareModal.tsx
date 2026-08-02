"use client";

import { useState } from "react";
import { Copy, Check, X, Share2, Twitter, Facebook } from "lucide-react";
import { GameMetadata } from "@/types/game";

interface ShareModalProps {
  game: GameMetadata;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ game, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Play ${game.title} on GameHub! 🎮🔥`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Share2 className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Share {game.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">
            Direct Game Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full rounded-xl border border-border/60 bg-muted/50 px-3.5 py-2.5 text-xs text-foreground focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700 transition-colors flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
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
        <div className="space-y-2 pt-2 border-t border-border/40">
          <label className="text-xs font-semibold text-muted-foreground">
            Share to Socials
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareOnTwitter}
              className="flex items-center justify-center space-x-2 rounded-xl bg-slate-900 border border-border/60 p-2.5 text-xs font-bold text-sky-400 hover:bg-slate-800 transition-colors"
            >
              <Twitter className="h-4 w-4 fill-sky-400" />
              <span>X / Twitter</span>
            </button>
            <button
              onClick={shareOnFacebook}
              className="flex items-center justify-center space-x-2 rounded-xl bg-slate-900 border border-border/60 p-2.5 text-xs font-bold text-blue-500 hover:bg-slate-800 transition-colors"
            >
              <Facebook className="h-4 w-4 fill-blue-500" />
              <span>Facebook</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
