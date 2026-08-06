import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { Key, ArrowLeft, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Licensing Policy - PlayNow Legal",
  description: "How PlayNow licenses its game catalog via GameDistribution, plus the open-source license rules for any code we host directly.",
};

export default function LegalLicensesPage() {
  const licenseReportPath = path.join(process.cwd(), "src", "data", "license-report.json");
  let report: any = {};
  if (fs.existsSync(licenseReportPath)) {
    try {
      report = JSON.parse(fs.readFileSync(licenseReportPath, "utf-8"));
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link href="/compliance" className="inline-flex items-center space-x-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Legal Compliance Portal</span>
        </Link>

        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20 flex items-center space-x-1">
              <Key className="h-3.5 w-3.5 mr-1" />
              <span>Legal Policy Document</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">Licensing Policy</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PlayNow's game catalog is currently sourced entirely through a <strong className="text-foreground">GameDistribution publisher agreement</strong> — a licensed, commercial arrangement, not open-source code we've copied. If PlayNow ever hosts original or open-source-derived code directly in the future, it will only accept the permissive licenses below.
          </p>
        </div>

        {/* Primary licensing model */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>Current Sourcing Model</span>
          </h2>
          <Card className="p-5 border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">Network-Licensed (GameDistribution)</Badge>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every game currently on PlayNow is embedded from GameDistribution's publisher network under their standard terms. GameDistribution — not PlayNow — owns and is responsible for this game code; PlayNow's role is limited to embedding and screening titles for brand/trademark conflicts before listing them.
            </p>
          </Card>
        </div>

        {/* Allowed Licenses (for any future directly-hosted code) */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>Permitted Licenses for Any Directly-Hosted Code</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">MIT License</Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Permissive license allowing commercial reuse, modification, distribution, and private use with copyright retention.
              </p>
            </Card>

            <Card className="p-5 border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">Apache License 2.0</Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Permissive license providing explicit grant of patent rights and trademark preservation rules.
              </p>
            </Card>

            <Card className="p-5 border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">BSD 2-Clause / 3-Clause</Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Permissive license requiring attribution without endorsement of derivative products using original author names.
              </p>
            </Card>

            <Card className="p-5 border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40">ISC License</Badge>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Functionally equivalent to 2-clause BSD license with streamlined legal language.
              </p>
            </Card>
          </div>
        </div>

        {/* Prohibited Licenses */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-rose-400" />
            <span>Prohibited & Rejected Licenses</span>
          </h2>

          <Card className="p-5 border-rose-500/30 bg-rose-500/5 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-rose-500/40">GPL / AGPL / LGPL</Badge>
              <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-rose-500/40">No License Specified</Badge>
              <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-rose-500/40">Unknown Origin</Badge>
              <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-rose-500/40">All Rights Reserved</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Copyleft licenses (GPL/AGPL) and unverified software origins are automatically rejected by our legal ingestion pipeline to protect commercial readiness.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}
