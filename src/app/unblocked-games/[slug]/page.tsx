import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { getGameBySlug, getRelatedGames, getAllGames } from "@/lib/games";
import { GamePlayer } from "@/components/games/GamePlayer";
import { GameCard } from "@/components/games/GameCard";
import { EmbedGameButton } from "@/components/games/EmbedGameButton";
import { SITE_URL } from "@/lib/site";

interface UnblockedGamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: UnblockedGamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "Unblocked Game Not Found - PlayThorn" };

  const displayTitle = game.derivedTitle || game.title;
  const title = `${displayTitle} Unblocked - Play Free Online at School | PlayThorn`;
  const description = `Play ${displayTitle} unblocked free online on PlayThorn. High-speed HTML5 browser game with no downloads required. Optimized for school Wi-Fi and Chromebooks.`;
  const image = game.coverImage || game.thumbnailUrl;

  return {
    title,
    description,
    keywords: [
      `${displayTitle} unblocked`,
      `${displayTitle} unblocked at school`,
      `${displayTitle} premium unblocked`,
      "unblocked games 76",
      "unblocked games 66",
      "free unblocked games",
      game.category
    ],
    alternates: { canonical: `${SITE_URL}/unblocked-games/${game.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/unblocked-games/${game.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function UnblockedGamePage({ params }: UnblockedGamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  if (game.slug !== slug) {
    permanentRedirect(`/unblocked-games/${game.slug}`);
  }

  const relatedGames = getRelatedGames(game, 6);
  const displayTitle = game.derivedTitle || game.title;

  const faqs = [
    {
      question: `Is ${displayTitle} Unblocked completely free on PlayThorn?`,
      answer: `Yes, ${displayTitle} Unblocked is 100% free to play directly in your web browser without registration or hidden fees.`
    },
    {
      question: `Can I play ${displayTitle} on school Chromebooks or restricted Wi-Fi?`,
      answer: `Yes! PlayThorn uses optimized edge proxy nodes and client-side HTML5 rendering to ensure ${displayTitle} runs smoothly on school Wi-Fi and Chromebooks.`
    },
    {
      question: `Does ${displayTitle} require any flash or plugin downloads?`,
      answer: `No flash or plugins required. ${displayTitle} runs on pure HTML5 and JavaScript standard technology.`
    },
    {
      question: `How do I save my progress in ${displayTitle} Unblocked?`,
      answer: `Your game progress and high scores are automatically saved to your browser's local storage.`
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        name: `${displayTitle} Unblocked`,
        description: game.description,
        image: game.coverImage || game.thumbnailUrl,
        genre: game.category,
        applicationCategory: "GameApplication",
        gamePlatform: "HTML5 Web Browser",
        operatingSystem: "Chromebook, Windows, macOS, iOS, Android",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Unblocked Games", item: `${SITE_URL}/unblocked-games` },
          { "@type": "ListItem", position: 3, name: `${displayTitle} Unblocked`, item: `${SITE_URL}/unblocked-games/${game.slug}` }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header Banner */}
      <div className="mx-auto max-w-[1800px] space-y-4 px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/unblocked-games" className="hover:text-foreground">Unblocked Games</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-foreground">{displayTitle} Unblocked</span>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>100% UNBLOCKED FOR SCHOOL & WORK</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight">
              {displayTitle} Unblocked
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <EmbedGameButton slug={game.slug} title={displayTitle} />
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <GamePlayer game={game} />
        </div>

        {/* Key Unblocked Features Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4">
          <div className="flex items-start space-x-3 rounded-xl border border-border bg-card p-4">
            <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Fast HTML5 Loading</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Instant browser execution without plug-ins.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 rounded-xl border border-border bg-card p-4">
            <Lock className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Bypass School Filters</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Proxy-ready architecture for restricted networks.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 rounded-xl border border-border bg-card p-4">
            <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Chromebook Compatible</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Optimized lightweight performance on all devices.</p>
            </div>
          </div>
        </div>

        {/* Overview & Game Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-xl font-bold">About {displayTitle} Unblocked</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {game.description}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Looking to play {displayTitle} at school, college, or workplace? PlayThorn provides the best unblocked gaming experience with high-speed canvas rendering, zero lag, and full desktop/mobile controls support.
              </p>
            </section>

            {/* School Unblocked FAQs */}
            <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <h3 className="text-sm font-bold text-foreground">{faq.question}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Related Games */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h3 className="text-base font-bold flex items-center justify-between">
                <span>Top Unblocked Games</span>
                <Link href="/unblocked-games" className="text-xs text-primary hover:underline">View All</Link>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {relatedGames.map((relGame) => (
                  <GameCard key={relGame.id} game={relGame} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
