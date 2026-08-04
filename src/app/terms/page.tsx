import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  FileText,
  Gamepad2,
  ShieldAlert,
  Scale,
  Ban,
  Megaphone,
  RefreshCw,
  Mail,
} from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "Terms of Service - PlayNow";
const DESCRIPTION =
  "The Terms of Service for using PlayNow's free browser games site: acceptable use, third-party game licensing, disclaimers, and how to reach us.";
const H1 = "Terms of Service";
const LAST_UPDATED = "August 4, 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: `${H1} - ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/terms`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: H1, item: `${SITE_URL}/terms` },
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

      {/* Header */}
      <div className="space-y-2 border-b border-border/60 pb-6">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20 uppercase tracking-wider">
          Last Updated: {LAST_UPDATED}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">{H1}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          These Terms of Service (&quot;Terms&quot;) govern your use of{" "}
          {SITE_URL.replace("https://", "")} (&quot;PlayNow&quot;, &quot;we&quot;,
          &quot;us&quot;). By using the site, you agree to these Terms.
        </p>
      </div>

      {/* Description of service */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-primary" />
          1. The Service
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          PlayNow provides free access to a catalog of browser-playable HTML5 games. No
          download, install, or account is required to play. Games are licensed and embedded
          from GamePix, a third-party game publisher network — see our{" "}
          <Link href="/compliance" className="text-primary hover:underline">
            Legal Compliance &amp; Sourcing portal
          </Link>{" "}
          for full details on how the catalog is sourced. We may add, remove, or change games
          in the catalog at any time without notice.
        </p>
      </section>

      {/* Acceptable use */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Ban className="h-5 w-5 text-rose-400" />
          2. Acceptable Use
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You agree to use PlayNow only for lawful purposes. You agree not to:
        </p>
        <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc list-inside pl-2">
          <li>Scrape, crawl, or bulk-download the site&apos;s content outside of normal browsing;</li>
          <li>Attempt to interfere with, disable, or circumvent the site&apos;s ad delivery or security measures;</li>
          <li>Reverse engineer, decompile, or attempt to extract source code from embedded games;</li>
          <li>Use the site to distribute malware, spam, or unlawful content; or</li>
          <li>Misrepresent your affiliation with PlayNow or any game publisher.</li>
        </ul>
      </section>

      {/* IP */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Scale className="h-5 w-5 text-cyan-400" />
          3. Intellectual Property
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The PlayNow site design, branding, and original written content are owned by
          PlayNow. The games available through PlayNow are owned by their respective
          developers and are licensed to PlayNow through GamePix&apos;s publisher network —
          PlayNow does not claim authorship or ownership of any embedded game&apos;s code,
          art, or audio. Full per-game sourcing information is available on our{" "}
          <Link href="/legal/attributions" className="text-primary hover:underline">
            Game Sourcing Credits
          </Link>{" "}
          page. If you believe content on PlayNow infringes your copyright, see our{" "}
          <Link href="/legal/dmca" className="text-primary hover:underline">
            DMCA Policy
          </Link>
          .
        </p>
      </section>

      {/* Third-party services */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-amber-400" />
          4. Third-Party Services &amp; Advertising
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          PlayNow is supported by display advertising served through Google AdSense and uses
          Google Analytics and Vercel Analytics/Speed Insights to understand site usage — see
          our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          for details. Embedded games are served from GamePix&apos;s platform and are subject
          to GamePix&apos;s own terms; PlayNow is not responsible for the availability,
          content, or behavior of individual embedded games beyond the screening described in
          our compliance portal.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-orange-400" />
          5. Disclaimer of Warranties
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          PlayNow is provided &quot;as is&quot; and &quot;as available,&quot; without
          warranties of any kind, express or implied. We don&apos;t guarantee that the site or
          any particular game will be uninterrupted, error-free, or available at all times —
          individual games are hosted by GamePix and their availability can change outside of
          our control.
        </p>
      </section>

      {/* Liability */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Scale className="h-5 w-5 text-cyan-400" />
          6. Limitation of Liability
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          To the fullest extent permitted by applicable law, PlayNow and its operators will not
          be liable for any indirect, incidental, or consequential damages arising from your
          use of the site or any embedded game.
        </p>
      </section>

      {/* Governing law */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-400" />
          7. Termination &amp; Changes
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We may restrict or terminate access to the site for anyone who violates these Terms.
          We may update these Terms from time to time; the &quot;Last Updated&quot; date above
          reflects the most recent revision. Continued use of PlayNow after a change means you
          accept the updated Terms.
        </p>
      </section>

      {/* Changes */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-cyan-400" />
          8. Governing Law
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          These Terms are governed by applicable law, without regard to conflict-of-law
          principles, to the extent enforceable in your jurisdiction.
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Questions?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you have questions about these Terms, see our{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
