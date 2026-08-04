# 🚀 PLAYBOOK 1: PROGRAMMATIC SEO ENGINE (pSEO) FOR PLAYTHORN.COM
> **Agency Goal:** Scale organic landing pages from 238 to 5,000+ targeted keywords and achieve **#1 Rankings on Google** for high-intent queries (`[Game Name] unblocked`, `games like [Game]`, `free online [genre] games`).

---

## 📌 Executive Summary
Programmatic SEO (pSEO) is the core engine used by Poki, CrazyGames, and Y8 to capture millions of organic visitors monthly. Instead of writing manual blog posts, we build an automated architectural engine that generates rich, indexable, schema-powered landing pages for every game, category, tag, and game similarity cluster.

---

## 🏗️ 1. Technical URL Taxonomy & Silo Architecture

To maximize crawl efficiency and prevent keyword cannibalization, PlayThorn follows a strict 4-level URL hierarchy:

```
https://playthorn.com/
├── /                                   -> Tier 0: Domain Authority Hub
├── /unblocked-games                    -> Tier 1: Primary High-Intent Keyword Magnet (500K+/mo)
├── /category/[category]                -> Tier 1: Genre Hubs (e.g. /category/racing, /category/action)
├── /games-like/[slug]                  -> Tier 2: Comparison Hubs (e.g. /games-like/minecraft)
├── /tag/[tag]                          -> Tier 2: Micro-Feature Hubs (e.g. /tag/2-player, /tag/3d)
└── /game/[slug]                        -> Tier 3: Core Game Detail Pages (e.g. /game/mr-racer)
```

### Internal Link Equity Rules:
1. **Upward Linking**: Every Tier 3 `/game/[slug]` page links directly to its parent `/category/[genre]` and related `/tag/[tag]` pages.
2. **Horizontal Linking**: Every game page renders a dynamic grid of 6–12 related games sharing the same category or matching 2+ tags.
3. **Downward Linking**: Category pages spotlight Top 10 Trending, Newly Imported, and Editor's Choice games.
4. **Cross-Silo Magnet Linking**: Main magnet hubs (`/unblocked-games`, `/games-like/minecraft`) pass direct link juice to top 25 highest-converting titles.

---

## 📝 2. The 1,000+ Word Game Page Content Engine

Google's **Helpful Content System** penalizes pages with embedded iframes and thin text (under 200 words). Every game detail page on PlayThorn must render **800–1,000+ words** of structured, valuable content.

### Automated Page Section Blueprint:

| Section | Target Word Count | Content Structure |
| :--- | :--- | :--- |
| **1. Header & Player Canvas** | 50 words | Game Title, Category Badges, Fullscreen Toolbar, Lazy-loaded Iframe Cover. |
| **2. Overview & Gameplay Loop** | 200 words | Narrative summary, core objective, progression mechanics, and difficulty curve. |
| **3. Controls & Hotkeys Table** | 150 words | HTML key badges table (WASD, Arrow Keys, Spacebar, Mouse Click, Touch gestures). |
| **4. Strategy & High-Score Pro Tips** | 250 words | Actionable advice for beginners and advanced players to beat levels/high scores. |
| **5. Technical Game Metadata** | 100 words | Rating (out of 5), Developer, Platform (HTML5), Mobile Compatibility, Release Date. |
| **6. Interactive FAQ Section** | 200 words | 4–6 collapsible Accordion FAQs (Is it free? Does it require download? Is it unblocked?). |
| **7. Related Games Grid** | N/A | 8 internal links with WebP thumbnails and visual hover animations. |

---

## 🏷️ 3. JSON-LD Rich Snippet Schema ecosystem

Structured data provides direct instructions to search engines, unlocking **Rich Snippets** (stars, FAQ accordions, search boxes) in Google SERPs.

### Mandatory Schemas per Route:

#### 1. Game Page (`/game/[slug]`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoGame",
      "name": "Mr Racer - Car Racing Game",
      "description": "Play Mr Racer online for free on PlayThorn. Experience high-speed 3D highway racing without downloads.",
      "genre": ["Racing", "3D", "Action"],
      "gamePlatform": "HTML5 Web Browser",
      "applicationCategory": "Game",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1240"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can I play Mr Racer unblocked at school?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Mr Racer on PlayThorn runs directly in your web browser with no installation required."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://playthorn.com" },
        { "@type": "ListItem", "position": 2, "name": "Racing", "item": "https://playthorn.com/category/racing" },
        { "@type": "ListItem", "position": 3, "name": "Mr Racer", "item": "https://playthorn.com/game/mr-racer" }
      ]
    }
  ]
}
```

---

## ⚡ 4. Dynamic XML Sitemap & Crawl Budget Execution

1. **Auto-Generated Sitemaps**: Next.js `sitemap.ts` programmatically builds `/sitemap.xml` splitting games, categories, tags, and static pages into structured sub-sitemaps.
2. **Canonical URL Hygiene**: Strict `rel="canonical"` tags prevent duplicate parameter indexing (`?ref=feed`, `?variant=mobile`).
3. **Google Indexing API Integration**: Trigger instant indexation requests via Google Search Console API upon importing new game batches.

---

> **Status:** Created `PLAYBOOK_1_PROGRAMMATIC_SEO_ENGINE.md`.
