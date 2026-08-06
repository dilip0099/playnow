import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Mail,
  Bug,
  Copyright,
  Megaphone,
  MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "Contact PlayThorn";
const DESCRIPTION =
  "Get in touch with PlayThorn for general questions, bug reports, DMCA/copyright notices, or advertising inquiries.";
const H1 = "Contact Us";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `${H1} - ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/contact`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: H1, item: `${SITE_URL}/contact` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
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
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">{H1}</h1>
          <p className="text-sm text-foreground/80 max-w-xl leading-relaxed">
            PlayThorn is a small, independently run site — email is the best way to reach us.
            We read every message; response times can vary, but we do our best to reply
            promptly.
          </p>
        </div>
      </div>

      {/* Contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">General Questions</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Site feedback, questions about a game, or anything else that doesn&apos;t fit the
            categories below.
          </p>
          <a
            href="mailto:contact@playthorn.com"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            <Mail className="h-4 w-4" />
            contact@playthorn.com
          </a>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
            <Bug className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Bug Reports</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Found a game that won&apos;t load or a broken page? Include the game&apos;s name,
            the page URL, and your browser/device.
          </p>
          <a
            href="mailto:contact@playthorn.com?subject=Bug%20Report"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            <Mail className="h-4 w-4" />
            contact@playthorn.com
          </a>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <Copyright className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Copyright / DMCA</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To report copyright infringement, see our{" "}
            <Link href="/legal/dmca" className="text-primary hover:underline">
              DMCA Policy
            </Link>{" "}
            for what a valid notice must include.
          </p>
          <a
            href="mailto:dmca@playthorn.com?subject=DMCA%20Takedown%20Request"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            <Mail className="h-4 w-4" />
            dmca@playthorn.com
          </a>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
            <Megaphone className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Advertising &amp; Business</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Advertising, partnership, or business inquiries.
          </p>
          <a
            href="mailto:contact@playthorn.com?subject=Advertising%20Inquiry"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            <Mail className="h-4 w-4" />
            contact@playthorn.com
          </a>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Note: for questions about a specific game&apos;s underlying code, developer, or
        original license, GameMonetize (our game licensing partner) manages those relationships
        directly — see our{" "}
        <Link href="/compliance" className="text-primary hover:underline">
          Legal Compliance &amp; Sourcing portal
        </Link>{" "}
        for that game&apos;s source link.
      </p>
    </div>
  );
}
