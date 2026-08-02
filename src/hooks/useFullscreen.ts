"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

// A landscape game entered fullscreen on a phone still held upright is cramped and, if the
// player then rotates the phone, can overflow the screen (see GamePlayer's fullscreen sizing
// fix) — locking orientation up front avoids that entirely on the browsers that support it.
// iOS Safari doesn't implement the Screen Orientation lock API at all, so this silently no-ops
// there; the rotate-device hint in GamePlayer covers that case instead.
type PreferredOrientation = "landscape" | "portrait";

export function useFullscreen(elementRef: RefObject<HTMLElement | null>, preferredOrientation?: PreferredOrientation) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    if (!elementRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await elementRef.current.requestFullscreen();
        setIsFullscreen(true);
        if (preferredOrientation) {
          try {
            await (screen.orientation as any)?.lock?.(preferredOrientation);
          } catch {
            // Unsupported (iOS Safari) or denied by the browser — not fatal.
          }
        }
      } else {
        try {
          (screen.orientation as any)?.unlock?.();
        } catch {
          // No-op if unsupported.
        }
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Error toggling fullscreen mode:", err);
    }
  }, [elementRef, preferredOrientation]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
}
