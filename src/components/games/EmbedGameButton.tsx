"use client";

import { useState } from "react";
import { Code2, Copy, Check } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { SITE_URL } from "@/lib/site";

interface EmbedGameButtonProps {
  slug: string;
  title: string;
}

// Builds the exact copy-paste snippet a third-party site would drop into their own page —
// points at our dedicated chrome-free /embed/[slug] route, not the full game page.
export function EmbedGameButton({ slug, title }: EmbedGameButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedUrl = `${SITE_URL}/embed/${slug}`;
  const snippet = `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>\n<p style="font-size:12px;text-align:center;">Powered by <a href="${SITE_URL}" target="_blank" rel="noopener">PlayThorn Free Online Games</a></p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center space-x-1.5 rounded-xl border border-border bg-muted px-3.5 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-accent"
      >
        <Code2 className="h-4 w-4" />
        <span>Embed This Game</span>
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Embed This Game" className="space-y-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Paste this snippet into your own site to embed {title} in a responsive iframe.
        </p>

        <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-muted/50 p-4 font-mono text-[11px] leading-relaxed text-foreground/80">
          {snippet}
        </pre>

        <button
          onClick={handleCopy}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-colors hover:bg-primary-hover"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Embed Code</span>
            </>
          )}
        </button>
      </Dialog>
    </>
  );
}
