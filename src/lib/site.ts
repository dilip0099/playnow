// Single source of truth for the site's canonical URL — used by metadataBase, the sitemap,
// robots.txt, and per-page JSON-LD. Falls back to a clearly-placeholder value until a real
// production domain is chosen (see the GameDistribution ads.txt note: no domain decided as of yet).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://playthorn.com";
export const SITE_NAME = "PlayNow";
