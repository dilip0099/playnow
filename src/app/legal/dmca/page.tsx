import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Copyright, FileCheck, Mail, ShieldAlert, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "DMCA Policy - PlayNow Legal";
const DESCRIPTION =
  "PlayNow's DMCA / copyright takedown policy: how to submit a valid infringement notice and how counter-notifications work.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/legal/dmca" },
  openGraph: {
    title: `DMCA Policy - ${SITE_NAME}`,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE_URL}/legal/dmca`,
  },
};

export default function DmcaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/legal/dmca`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Compliance", item: `${SITE_URL}/compliance` },
          { "@type": "ListItem", position: 3, name: "DMCA Policy", item: `${SITE_URL}/legal/dmca` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link
          href="/compliance"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Legal Compliance Portal</span>
        </Link>

        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/20 flex items-center space-x-1">
              <Copyright className="h-3.5 w-3.5 mr-1" />
              <span>Legal Policy Document</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">DMCA Policy</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PlayNow respects the intellectual property rights of others and responds to clear
            notices of alleged copyright infringement submitted in accordance with the U.S.
            Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512.
          </p>
        </div>

        {/* Scope note */}
        <Card className="p-6 space-y-3 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-foreground">Before You Submit a Notice</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every game on PlayNow is embedded from{" "}
            <a
              href="https://gamemonetize.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GameMonetize
            </a>
            , a third-party HTML5 game publisher network — PlayNow does not host the
            underlying game code, art, or audio on its own servers (see our{" "}
            <Link href="/legal/assets" className="text-primary hover:underline">
              Asset Responsibility
            </Link>{" "}
            page). If your claim concerns a game&apos;s underlying code or assets rather than
            how it&apos;s presented on PlayNow, you may need to also contact GameMonetize directly,
            since they control that content. That said, we still act on valid notices
            concerning our own catalog listing — including removing or delisting a specific
            game from PlayNow&apos;s catalog.
          </p>
        </Card>

        {/* What to include */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-emerald-400" />
            What a Valid Takedown Notice Must Include
          </h2>
          <Card className="p-6 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              To be effective, your notice must be a written communication that includes
              substantially all of the following:
            </p>
            <ol className="text-xs text-muted-foreground leading-relaxed space-y-2 list-decimal list-inside pl-2">
              <li>
                A physical or electronic signature of the copyright owner or a person
                authorized to act on their behalf;
              </li>
              <li>
                Identification of the copyrighted work claimed to have been infringed, or, if
                multiple works are covered, a representative list;
              </li>
              <li>
                Identification of the material claimed to be infringing, with enough detail
                (e.g. the exact PlayNow game/page URL) for us to locate it;
              </li>
              <li>Your contact information — name, address, telephone number, and email address;</li>
              <li>
                A statement that you have a good-faith belief that use of the material is not
                authorized by the copyright owner, its agent, or the law; and
              </li>
              <li>
                A statement, made under penalty of perjury, that the above information is
                accurate and that you are the copyright owner or authorized to act on their
                behalf.
              </li>
            </ol>
          </Card>
        </div>

        {/* How to submit */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            How to Submit a Notice
          </h2>
          <Card className="p-6 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Send your notice by email, with subject line &quot;DMCA Takedown Request&quot;, to:
            </p>
            <a
              href="mailto:dmca@playthorn.com?subject=DMCA%20Takedown%20Request"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              dmca@playthorn.com
            </a>
            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
              We review notices as they come in and aim to respond promptly. If a notice is
              valid and complete, we will remove or disable access to the identified material
              (or delist the affected game from our catalog) and notify the party responsible
              for the content where applicable.
            </p>
          </Card>
        </div>

        {/* Counter-notice */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Scale className="h-5 w-5 text-cyan-400" />
            Counter-Notification
          </h2>
          <Card className="p-6 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you believe material was removed or disabled as a result of mistake or
              misidentification, you may submit a counter-notice to the same address above.
              A valid counter-notice must include your signature, identification of the
              material removed and its location before removal, a statement under penalty of
              perjury that you have a good-faith belief the material was removed in error,
              your contact information, and a statement consenting to the jurisdiction of the
              federal court in your district (or, if outside the U.S., an appropriate
              jurisdiction) to resolve the dispute.
            </p>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          For general questions, visit our{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact page
          </Link>
          . For details on how our game catalog is licensed and sourced, see the{" "}
          <Link href="/compliance" className="text-primary hover:underline">
            Legal Compliance &amp; Sourcing portal
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
