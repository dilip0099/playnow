import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Gamepad2,
  ShieldCheck,
  MousePointerClick,
  HeartHandshake,
  Smartphone,
  Layers,
} from "lucide-react";
import { getAllGames } from "@/lib/games";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "About PlayNow - Free Browser Games, No Download Required";
const DESCRIPTION =
  "PlayNow is an independent HTML5 browser games site. Learn how our catalog is licensed via GameDistribution, how the site is funded, and what we store about you.";
const H1 = "About PlayNow";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${H1} - ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${H1} - ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function AboutPage() {
  const totalGames = getAllGames().length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/about`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: H1, item: `${SITE_URL}/about` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-muted-foreground">
        <Link href="/" className="flex items-center hover:text-foreground transition-colors">
          <Home className="h-3.5 w-3.5 mr-1" />
          <span>Home</span>
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-bold">{H1}</span>
      </nav>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 space-y-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20 uppercase tracking-wider">
            Who We Are
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {H1}
          </h1>
          <p className="text-sm text-foreground/80 max-w-2xl leading-relaxed">
            PlayNow is a free, independent browser games site — {totalGames} HTML5 games
            you can play instantly, with nothing to install and nothing to sign up for.
          </p>
        </div>
      </div>

      {/* What PlayNow Is */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-primary" />
          What PlayNow Is
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          PlayNow ({SITE_URL.replace("https://", "")}) is a catalog of {totalGames} free,
          browser-playable games across nine categories — action, puzzle, arcade, racing,
          adventure, strategy, sports, .io/multiplayer, and classic games like chess, mahjong,
          and solitaire. Every game runs directly in the page as pure HTML5: no downloads, no
          installers, no plugins, and no browser extensions required. Click a game and it loads.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We&apos;re a small, independently run site. We don&apos;t build the games in our
          catalog ourselves — our role is to license, screen, organize, and present them well,
          and to be straightforward about where they come from and what we do (and don&apos;t)
          collect from visitors.
        </p>
      </section>

      {/* How the Catalog Is Sourced */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          How Our Games Are Sourced
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Every game on PlayNow is licensed through{" "}
          <a
            href="https://gamedistribution.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GameDistribution (Azerion)
          </a>
          , a leading HTML5 game publisher network, under a standard publisher agreement.
          GameDistribution — not PlayNow — owns and is responsible for the underlying game code; each
          title is embedded directly from GameDistribution&apos;s network. Before a game is added to our
          catalog it&apos;s screened for trademark and brand-conflict risk, and we keep a fully
          public record of that process.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For the complete, real-time sourcing data — per-game GameDistribution MD5 IDs, license terms,
          and trademark-risk screening results — see our{" "}
          <Link href="/compliance" className="text-primary hover:underline">
            Public Legal Compliance &amp; Sourcing
          </Link>{" "}
          portal.
        </p>
      </section>

      {/* How the Site Works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
          <Layers className="h-5 w-5 text-cyan-400" />
          How PlayNow Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <MousePointerClick className="h-4 w-4 text-primary" />
              No account needed
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You can play every game on PlayNow without creating an account or signing in.
              Favorites and recently-played history are saved locally in your own browser, not
              on our servers — see our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              for exactly what&apos;s stored and where.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Smartphone className="h-4 w-4 text-primary" />
              Works on desktop &amp; mobile
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Games run in any modern browser, including on phones and tablets where the
              underlying game supports touch controls. No app-store download required.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <HeartHandshake className="h-4 w-4 text-primary" />
              Free, supported by ads
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              PlayNow is free to use. The site is supported by display advertising (Google
              AdSense) rather than a paywall or required signup.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Transparent sourcing
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every game links back to its real GameDistribution catalog entry. Nothing in our catalog
              is presented as our own original work.
            </p>
          </div>
        </div>
      </section>

      {/* Learn More Links */}
      <section className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-6">
        <h2 className="text-lg font-bold text-foreground">Learn More</h2>
        <div className="flex flex-wrap gap-3 text-xs font-bold">
          <Link href="/compliance" className="rounded-full bg-muted px-3 py-1.5 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            Legal Compliance Portal
          </Link>
          <Link href="/privacy" className="rounded-full bg-muted px-3 py-1.5 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="rounded-full bg-muted px-3 py-1.5 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="rounded-full bg-muted px-3 py-1.5 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
