"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DISPLAY_XL } from "@/components/home/home-fonts";
import { Input } from "@/components/ui/input";
import { DocumentCard } from "@/components/data/document-card";
import { useDocuments, useDownloadDocument } from "@/lib/hooks/useDocuments";
import type { DocumentCategory, PortalDocument } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES: Array<{ id: DocumentCategory | "all"; label: string }> = [
  { id: "all",        label: "All" },
  { id: "policy",     label: "Policies" },
  { id: "sop",        label: "SOPs" },
  { id: "report",     label: "Reports" },
  { id: "evaluation", label: "Evaluations" },
  { id: "guideline",  label: "Guidelines" },
  { id: "research",   label: "Research" },
];

export default function DocumentsPage() {
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useDocuments({
    type: category === "all" ? undefined : category,
    search: query || undefined,
  });
  const downloadMutation = useDownloadDocument();

  const documents = useMemo(() => data?.data ?? [], [data]);

  const handleDownload = (doc: PortalDocument) => {
    downloadMutation.mutate(doc.slug, {
      onSuccess: (result) => {
        window.open(result.downloadUrl, "_blank", "noopener,noreferrer");
      },
      onError: (err: unknown) => {
        toast.error(err instanceof Error ? err.message : "Failed to generate download link");
      },
    });
  };

  return (
    <main className="flex-1">
      <section className="relative isolate overflow-hidden bg-[#0D3B14] text-white">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_90%_at_85%_0%,rgba(46,125,50,0.5),transparent_65%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
          aria-hidden
        />
        <Container size="wide" className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">Library</p>
          <h1 className={`${DISPLAY_XL} mt-3 text-4xl font-bold sm:text-5xl`}>Document library</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            Policies, SOPs, research reports, evaluation findings and historical archives for Niger
            State health data governance.
          </p>

          <div className="mt-8 space-y-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search documents…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search documents"
                className="h-12 rounded-full border-0 bg-white pl-11 text-base text-foreground shadow-sm placeholder:text-muted-foreground"
              />
            </div>
            <div
              role="group"
              aria-label="Filter by type"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  aria-pressed={category === cat.id}
                  className={cn(
                    "min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
                    category === cat.id
                      ? "border-white bg-white text-[#0D3B14]"
                      : "border-white/20 bg-white/5 text-white/85 hover:bg-white/15"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container size="wide" className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-5">
          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="size-5 animate-spin" />
              <span>Loading documents…</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-16 text-center text-muted-foreground gap-3">
              <BookOpen className="size-12 opacity-30" />
              <p className="font-medium">Couldn&apos;t load documents</p>
              <p className="text-sm">Please try again shortly</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {documents.length} document{documents.length !== 1 ? "s" : ""} found
              </p>

              {documents.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center text-muted-foreground gap-3">
                  <BookOpen className="size-12 opacity-30" />
                  <p className="font-medium">No documents found</p>
                  <p className="text-sm">Try changing your search or category filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {documents.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} onDownload={handleDownload} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
