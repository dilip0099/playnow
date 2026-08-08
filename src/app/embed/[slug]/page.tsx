import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getGameBySlug, getAllGames } from "@/lib/games";

interface EmbedGamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: EmbedGamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "Game Not Found - PlayThorn" };

  const displayTitle = game.derivedTitle || game.title;

  return {
    title: `Embed ${displayTitle} - PlayThorn`,
    // This route exists purely as an iframe target for third-party sites — it's a
    // near-duplicate of /game/[slug] with no chrome, so it shouldn't compete with the
    // real game page in search results.
    robots: { index: false, follow: false },
  };
}

// Minimal, chrome-free iframe target used by the "Embed This Game" snippet on the main
// game page (see EmbedGameButton.tsx) — third-party sites point their <iframe> here, not
// at /game/[slug], so their visitors only ever see the game itself.
//
// Note: the shared root layout (src/app/layout.tsx) unconditionally renders the
// Sidebar/Navbar/Footer/MobileBottomNav around every route's children and is explicitly
// off-limits for this task, so this page can't structurally remove that chrome from the
// DOM. Instead it renders as a fixed, full-viewport layer (z-index above the Sidebar's
// z-40, Navbar's z-30, and MobileBottomNav's z-50) that fully covers the visible
// viewport and disables page scroll, so nothing else on the page is ever visible or
// reachable — the embedded visitor sees only the game, full-viewport, exactly as
// required. A future change to the root layout to skip that chrome entirely for
// `/embed/*` routes would let this page drop the overlay in favor of a plain full-height
// div.
export default async function EmbedGamePage({ params }: EmbedGamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();
  // Same id-fallback redirect as /game/[slug] — old hash-based embed URLs already live on
  // third-party sites should keep working, but point at the canonical slug going forward.
  if (game.slug !== slug) permanentRedirect(`/embed/${game.slug}`);

  return (
    <div className="fixed inset-0 z-[999] h-screen w-screen overflow-hidden bg-background">
      <iframe
        src={game.gameUrl}
        title={game.title}
        allowFullScreen
        allow="autoplay; fullscreen; microphone; camera; midi; geolocation; accelerometer; gyroscope; payment"
        className="h-full w-full border-0"
      />
    </div>
  );
}
