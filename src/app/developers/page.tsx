"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, GitBranch, Key, CheckCircle2, ArrowRight, Code2, Sparkles, Send, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SupportedLicense } from "@/data/licenses";

export default function DevelopersPage() {
  const [developerName, setDeveloperName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [license, setLicense] = useState<SupportedLicense>("MIT");
  const [category, setCategory] = useState("arcade");
  const [description, setDescription] = useState("");
  const [assetSource, setAssetSource] = useState("Original");

  const [checklist, setChecklist] = useState({
    permissiveLicense: false,
    zeroTrademark: false,
    originalSourceAvailable: false,
    commercialUseAllowed: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repositoryUrl.includes("github.com")) {
      alert("Please provide a valid GitHub repository URL.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Banner */}
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-950 p-8 sm:p-10 shadow-xl space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-400 border border-purple-500/20">
            <Code2 className="h-4 w-4 mr-1.5" />
            <span>Developer Submission Portal</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Publish Open-Source Games on GameHub
          </h1>
          
          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
            Submit your open-source HTML5 browser game for automated legal compliance audit, repository authentication, and global hosting on GameHub.
          </p>
        </div>

        {/* Submission Form Card */}
        {submitted ? (
          <Card className="p-8 border-emerald-500/40 bg-emerald-500/10 text-center space-y-4 shadow-xl">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Submission Received for Pre-Flight Audit!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your repository <code className="text-cyan-400 bg-slate-900 px-2 py-1 rounded font-mono text-xs">{repositoryUrl}</code> has been queued for automated license verification, SHA256 hashing, and trademark scan.
            </p>
            <div className="pt-2">
              <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl font-bold">
                Submit Another Game
              </Button>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6 sm:p-8 border-border/60 bg-card/60 backdrop-blur-md space-y-6 shadow-xl">
              
              <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3 flex items-center space-x-2">
                <FileCode className="h-5 w-5 text-cyan-400" />
                <span>1. Developer & Repository Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Developer / Author Name</label>
                  <Input
                    required
                    value={developerName}
                    onChange={(e) => setDeveloperName(e.target.value)}
                    placeholder="e.g. Alex Rivers"
                    className="rounded-xl bg-background/60 border-border/60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Contact Email</label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dev@example.com"
                    className="rounded-xl bg-background/60 border-border/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">GitHub Repository URL</label>
                <Input
                  required
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="rounded-xl bg-background/60 border-border/60 font-mono text-xs"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground border-b border-border/40 pb-3 pt-4 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span>2. Game Details & Licensing</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Game Title</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cyber Runner 2099"
                    className="rounded-xl bg-background/60 border-border/60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">License Type</label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value as SupportedLicense)}
                    className="w-full rounded-xl bg-background/60 border border-border/60 p-2.5 text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="MIT">MIT License</option>
                    <option value="Apache-2.0">Apache License 2.0</option>
                    <option value="BSD-2-Clause">BSD 2-Clause</option>
                    <option value="BSD-3-Clause">BSD 3-Clause</option>
                    <option value="ISC">ISC License</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Primary Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-background/60 border border-border/60 p-2.5 text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="arcade">Arcade</option>
                    <option value="puzzle">Puzzle</option>
                    <option value="action">Action</option>
                    <option value="sports">Sports</option>
                    <option value="strategy">Strategy</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Asset Origin Declaration</label>
                  <select
                    value={assetSource}
                    onChange={(e) => setAssetSource(e.target.value)}
                    className="w-full rounded-xl bg-background/60 border border-border/60 p-2.5 text-xs font-bold text-foreground focus:outline-none"
                  >
                    <option value="Original">Original GameHub / Custom Vector Assets</option>
                    <option value="CC0">CC0 Public Domain Assets</option>
                    <option value="Open Licensed">Open Licensed Media</option>
                  </select>
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className="rounded-2xl bg-slate-900/60 p-5 border border-border/40 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Developer Legal Compliance Checklist</span>
                </h3>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={checklist.permissiveLicense}
                      onChange={(e) => setChecklist({ ...checklist, permissiveLicense: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    <span>Repository contains an explicit permissive license (MIT, Apache-2.0, BSD, ISC).</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={checklist.zeroTrademark}
                      onChange={(e) => setChecklist({ ...checklist, zeroTrademark: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    <span>Game contains zero trademarked commercial names, characters, or logos.</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={checklist.originalSourceAvailable}
                      onChange={(e) => setChecklist({ ...checklist, originalSourceAvailable: e.target.checked })}
                      className="rounded accent-purple-500"
                    />
                    <span>Full source code and HTML5 assets are publicly accessible on GitHub.</span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 shadow-lg shadow-purple-500/20 text-sm flex items-center justify-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Submit Game for Legal Compliance Audit</span>
              </Button>

            </Card>
          </form>
        )}

      </div>
    </div>
  );
}
