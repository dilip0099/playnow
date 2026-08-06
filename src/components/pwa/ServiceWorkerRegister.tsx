"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("PlayThorn ServiceWorker registered successfully:", reg.scope);
          })
          .catch((err) => {
            console.error("PlayThorn ServiceWorker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
