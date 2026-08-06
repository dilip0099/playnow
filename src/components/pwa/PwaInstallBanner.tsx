"use client";

import { useState, useEffect } from "react";
import { Download, X, Sparkles, Smartphone, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running as standalone PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed banner recently (within 7 days)
    const dismissedTime = localStorage.getItem("playthorn_pwa_dismissed");
    if (dismissedTime) {
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - parseInt(dismissedTime, 10) < sevenDays) {
        return;
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("playthorn_pwa_dismissed", Date.now().toString());
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-background/95 p-5 shadow-2xl backdrop-blur-xl">
        {/* Ambient Glow */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start space-x-3.5">
          {/* App Logo */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary font-black text-primary-foreground shadow-glow-primary">
            <span className="text-xl">P</span>
          </div>

          {/* Content */}
          <div className="flex-1 pr-4">
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-black text-foreground">PlayThorn App</span>
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              Install 1-click App for full-screen gaming, 0.1s instant load & zero browser bar!
            </p>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="mt-3.5 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>No Storage</span>
          </span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>Full Screen</span>
          </span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>100% Free</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center space-x-2">
          <button
            onClick={handleInstallClick}
            className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-primary py-2.5 text-xs font-black text-primary-foreground shadow-glow-primary transition-all hover:scale-[1.02] hover:bg-primary-hover active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span>INSTALL APP NOW</span>
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-xl border border-border bg-muted/80 px-3 py-2.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
