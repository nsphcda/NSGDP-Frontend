"use client";

import Link from "next/link";
import { Download, Info, MapPin, RefreshCw } from "lucide-react";
import type { Dataset } from "@/types";
import { HEALTH_CATEGORY_LABELS } from "@/lib/constants/health";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DISPLAY_SM } from "@/components/home/home-fonts";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DatasetDownloadActions } from "@/components/data/dataset-download-actions";
import { VisibilityBadge } from "@/components/data/visibility-badge";

function shortDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-NG", { month: "short", year: "numeric" });
}

interface GeoHealthDatasetCardProps {
  dataset: Dataset;
  className?: string;
  onInfoClick: (dataset: Dataset) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (slug: string) => void;
}

export function GeoHealthDatasetCard({
  dataset,
  className,
  onInfoClick,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}: GeoHealthDatasetCardProps) {
  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg",
        selectionMode && selected && "border-primary ring-1 ring-primary/40",
        className
      )}
    >
      {selectionMode ? (
        <div className="absolute left-3 top-3 z-10">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect?.(dataset.slug)}
            aria-label={`Select ${dataset.title} for bulk download`}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onInfoClick(dataset)}
        className="absolute right-3 top-3 z-10 flex size-8 max-md:size-11 items-center justify-center rounded-full border bg-background hover:bg-muted transition-colors"
        aria-label={`More information about ${dataset.title}`}
      >
        <Info className="size-4 text-muted-foreground" />
      </button>

      <CardHeader className={cn("pb-2 pr-12", selectionMode && "pl-12")}>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <Badge className="w-fit bg-primary/10 text-primary border-0 text-xs">
            {HEALTH_CATEGORY_LABELS[dataset.healthCategory]}
          </Badge>
          {dataset.visibility !== "public" && (
            <VisibilityBadge visibility={dataset.visibility} />
          )}
        </div>
        <CardTitle className={cn("text-base line-clamp-2 leading-snug", DISPLAY_SM)}>
          <Link href={`/dataportal/${dataset.slug}`} className="hover:text-primary">
            {dataset.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-xs font-medium line-clamp-1">
          {dataset.organisation.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3">
        {dataset.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {dataset.description}
          </p>
        )}
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {dataset.lgaCoverage.length > 0 ? (
            <div className="flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden />
              <dt className="sr-only">Coverage</dt>
              <dd>
                {dataset.lgaCoverage.length >= 25
                  ? "Statewide"
                  : `${dataset.lgaCoverage.length} LGA${dataset.lgaCoverage.length === 1 ? "" : "s"}`}
              </dd>
            </div>
          ) : null}
          {shortDate(dataset.updatedAt) ? (
            <div className="flex items-center gap-1">
              <RefreshCw className="size-3.5" aria-hidden />
              <dt className="sr-only">Updated</dt>
              <dd>{shortDate(dataset.updatedAt)}</dd>
            </div>
          ) : null}
          {dataset.downloadCount > 0 ? (
            <div className="flex items-center gap-1">
              <Download className="size-3.5" aria-hidden />
              <dt className="sr-only">Downloads</dt>
              <dd className="tabular-nums">{dataset.downloadCount.toLocaleString()}</dd>
            </div>
          ) : null}
        </dl>
        <div className="flex flex-wrap gap-1">
          {dataset.formats.slice(0, 3).map((f) => (
            <Badge key={f} variant="outline" className="text-xs font-mono">
              {f}
            </Badge>
          ))}
        </div>
        {!selectionMode && (
          <DatasetDownloadActions
            datasetId={dataset.id}
            datasetSlug={dataset.slug}
            datasetTitle={dataset.title}
            visibility={dataset.visibility}
            datasetOrganisationId={dataset.organisation.id}
          />
        )}
      </CardContent>
    </Card>
  );
}
