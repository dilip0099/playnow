import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyGamesStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmptyGamesState({ icon: Icon, title, description, ctaHref, ctaLabel }: EmptyGamesStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground max-w-sm">{description}</p>
      </div>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="mt-2 inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
