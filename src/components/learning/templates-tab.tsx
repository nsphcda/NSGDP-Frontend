"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { METRIC_TONE } from "@/components/data/metric-card";
import { cn } from "@/lib/utils";
import { AUDIENCE_LABEL } from "@/lib/learning/helpers";
import { mediaUrl, useLearningContent } from "@/lib/learning/content";
import { downloadTemplate } from "@/lib/learning/templates";
import type { AudienceFilter } from "@/lib/learning/types";
import { EmptyNote } from "./learning-primitives";

export function TemplatesTab({ audience }: { audience: AudienceFilter }) {
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const { content } = useLearningContent();
  const TEMPLATES = content.templates;
  const audienceMatches = TEMPLATES.filter(
    (t) => audience === "all" || t.audience.includes(audience),
  );
  // Templates are blank starter files, so an audience with none of its own
  // (e.g. Public) still sees all of them, each badged with who it is for.
  const showingAll = audienceMatches.length === 0;
  const list = showingAll ? TEMPLATES : audienceMatches;

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-muted-foreground">
        Starter files that match what the portal expects. They download straight to your device, so
        you can fill them in before you start an upload.
      </p>
      {showingAll && list.length > 0 ? (
        <p className="text-[13px] text-muted-foreground">
          No templates are written for this audience. Showing all templates.
        </p>
      ) : null}

      {list.length === 0 ? (
        <EmptyNote>No templates available.</EmptyNote>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((t) => {
            const tone = METRIC_TONE[t.format === "CSV" ? "success" : "info"];
            const Icon = t.format === "CSV" ? FileSpreadsheet : FileText;
            return (
              <div key={t.id} className="flex flex-col rounded-2xl border bg-card p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                      tone.well,
                    )}
                  >
                    <Icon className={cn("size-5", tone.icon)} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-5">{t.name}</h3>
                    <p className="mt-1 text-[13px] text-muted-foreground">{t.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="h-5 text-xs">
                      {t.format}
                    </Badge>
                    {t.audience.map((a) => (
                      <Badge key={a} variant="outline" className="h-5 text-xs font-normal">
                        {AUDIENCE_LABEL[a]}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-9 gap-2"
                    onClick={() => {
                      if (t.fileUrl) {
                        // Admin-uploaded file: the API redirects to a signed URL.
                        window.open(mediaUrl(t.fileUrl), "_blank", "noopener");
                      } else {
                        downloadTemplate(t);
                      }
                      setDownloaded(t.id);
                    }}
                  >
                    <Download className="size-4" aria-hidden />
                    {downloaded === t.id ? "Downloaded" : "Download"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
