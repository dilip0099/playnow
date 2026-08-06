import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Database,
  BarChart3,
  Megaphone,
  Cookie,
  Baby,
  RefreshCw,
  Mail,
} from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "Privacy Policy - PlayThorn";
const DESCRIPTION =
  "PlayThorn's Privacy Policy: what data we collect (analytics, ads) and don't collect (no accounts), and what's stored locally in your browser for favorites and history.";
const H1 = "Privacy Policy";
const LAST_UPDATED = "August 4, 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `${H1} - ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/privacy`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: H1, item: `${SITE_URL}/privacy` },
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
          This policy explains, in plain language, exactly what {SITE_NAME} collects when you
          visit {SITE_URL.replace("https://", "")} — and just as importantly, what we don&apos;t
          collect. We don&apos;t require accounts, and we don&apos;t sell personal information.
        </p>
      </div>

      {/* No account / no signup */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Database className="h-5 w-5 text-emerald-400" />
          Information We Don&apos;t Collect
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          PlayThorn does not require you to create an account, and we do not have a login or
          registration system. We don&apos;t ask for your name, email address, or payment
          details to play any game on the site, and we don&apos;t operate any messaging or
          comment system that would collect personal content from you.
        </p>
      </section>

      {/* localStorage */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Database className="h-5 w-5 text-cyan-400" />
          Information Stored Locally in Your Browser
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Two features save small pieces of data using your browser&apos;s{" "}
          <code className="font-mono text-xs text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
            localStorage
          </code>{" "}
          — a standard web technology that keeps data on your own device, not on our servers:
        </p>
        <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc list-inside pl-2">
          <li>
            <strong className="text-foreground">Favorites</strong> — the list of games
            you&apos;ve marked as favorites, so the list is still there next time you visit.
          </li>
          <li>
            <strong className="text-foreground">Recently played</strong> — the last games
            you&apos;ve opened, so you can quickly get back to them.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This data lives only in your browser on your device. We never receive it, never see
          it, and can&apos;t associate it with you personally — it&apos;s never transmitted to
          PlayThorn or anyone else. You can clear it at any time by clearing your browser&apos;s
          site data/cookies for this site, or using private/incognito browsing.
        </p>
      </section>

      {/* Analytics */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-violet-400" />
          Analytics
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We use <strong className="text-foreground">Vercel Analytics</strong> and{" "}
          <strong className="text-foreground">Vercel Speed Insights</strong> to understand
          aggregate traffic patterns and page performance (like load times). These are
          privacy-focused, don&apos;t use tracking cookies, and report anonymized, aggregated
          data — they don&apos;t build an individual profile of you.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We also use <strong className="text-foreground">Google Analytics</strong>, which
          collects standard usage data such as pages viewed, approximate location (derived from
          IP address), device/browser type, and referring site, using cookies and similar
          technologies. You can opt out of Google Analytics tracking using the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>
      </section>

      {/* Advertising */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-amber-400" />
          Advertising
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          PlayThorn displays ads served by <strong className="text-foreground">Google
          AdSense</strong> to help cover hosting costs and keep the site free. Google and its
          advertising partners may use cookies (such as the DoubleClick cookie) to serve ads
          based on your visits to this and other sites. You can review or opt out of
          personalized advertising through{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Ads Settings
          </a>{" "}
          or{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            aboutads.info
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Games themselves are embedded from{" "}
          <a
            href="https://gamemonetize.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GameMonetize
          </a>
          , a third-party game publisher network (see our{" "}
          <Link href="/compliance" className="text-primary hover:underline">
            sourcing &amp; compliance portal
          </Link>{" "}
          for details). The embedded game player may load its own ads, analytics, or cookies
          from GameMonetize&apos;s advertising partners — this is governed by GameMonetize&apos;s own
          privacy policy, not this one, since PlayThorn does not control what runs inside that
          embedded player.
        </p>
      </section>

      {/* Cookies summary */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Cookie className="h-5 w-5 text-orange-400" />
          Cookies
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          PlayThorn itself doesn&apos;t set authentication or tracking cookies, since there are
          no user accounts. Cookies you may encounter while using the site come from the
          third-party services described above (Google Analytics, Google AdSense, and
          GameMonetize&apos;s embedded game player). You can control or delete cookies through your
          browser&apos;s settings at any time.
        </p>
      </section>

      {/* Children's privacy */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Baby className="h-5 w-5 text-pink-400" />
          Children&apos;s Privacy
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          PlayThorn is a general-audience site and is not directed specifically at children under
          13. We do not knowingly collect personal information from children. Because the site
          requires no account or personal information to use, we don&apos;t knowingly collect
          any such data from anyone, regardless of age. If you believe a child has provided us
          with personal information, please{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact us
          </Link>{" "}
          and we&apos;ll address it.
        </p>
      </section>

      {/* Changes */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-cyan-400" />
          Changes to This Policy
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time as the site or the services it
          uses change. The &quot;Last Updated&quot; date at the top of this page reflects the
          most recent revision. Continued use of PlayThorn after a change means you accept the
          updated policy.
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Questions?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If you have questions about this Privacy Policy, see our{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
