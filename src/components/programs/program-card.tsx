import Link from "next/link";
import { ArrowRight, Calendar, Camera, Clock, Download, MapPin, Target } from "lucide-react";
import type { Program, ProgramStatus, ProgramType } from "@/types";
import { ProgramCover } from "@/components/programs/program-cover";
import { DISPLAY_SM } from "@/components/home/home-fonts";
import { cn } from "@/lib/utils";

export const PROGRAM_TYPE_LABELS: Record<ProgramType, string> = {
  campaign: "Campaign",
  surveillance: "Surveillance",
  screening: "Screening",
  training: "Training",
  infrastructure: "Infrastructure",
  research: "Research",
  other: "Other",
};

const STATUS_STYLES: Record<ProgramStatus, string> = {
  ongoing: "bg-amber-400 text-amber-950",
  completed: "bg-emerald-500 text-white",
  planned: "bg-white text-neutral-800",
};

const STATUS_LABELS: Record<ProgramStatus, string> = {
  ongoing: "Ongoing",
  completed: "Completed",
  planned: "Planned",
};

function barColor(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function compact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n.toLocaleString();
}

/**
 * Picture-first programme card with the full summary below the photo: dates,
 * metric, coverage, progress and final reports. The title link is stretched
 * over the whole card; report downloads sit above it so they stay clickable.
 * Reused by the Programs page and, later, a home-page Programs section.
 */
export function ProgramCard({
  program,
  featured = false,
  className,
}: {
  program: Program;
  featured?: boolean;
  className?: string;
}) {
  const count = program.imageCount ?? 0;
  const reports =
    program.completionPercent === 100 && program.reports ? program.reports : [];
  const dateRange = program.endDate
    ? `${formatDate(program.startDate)} – ${formatDate(program.endDate)}`
    : formatDate(program.startDate);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg focus-within:shadow-lg",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          featured ? "aspect-[4/3] lg:aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        <div className="size-full transition-transform duration-700 group-hover:scale-[1.04]">
          <ProgramCover program={program} />
        </div>
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
            STATUS_STYLES[program.status],
          )}
        >
          {STATUS_LABELS[program.status]}
        </span>
        {count > 1 ? (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="size-3.5" aria-hidden />
            {count}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {PROGRAM_TYPE_LABELS[program.type] ?? program.type}
          </p>
          <h3
            className={cn(
              "text-lg font-semibold leading-snug sm:text-xl",
              featured && "lg:text-2xl",
              DISPLAY_SM,
            )}
          >
            <Link
              href={`/programs/${program.id}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none after:focus-visible:rounded-2xl after:focus-visible:outline-2 after:focus-visible:outline-offset-2 after:focus-visible:outline-primary"
            >
              {program.name}
            </Link>
          </h3>
          {program.description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {program.description}
            </p>
          ) : null}
        </div>

        <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs text-muted-foreground xs:grid-cols-2 sm:text-sm">
          <div className="flex items-start gap-1.5">
            <Calendar className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <dt className="sr-only">Dates</dt>
            <dd className="leading-snug">{dateRange}</dd>
          </div>
          {program.primaryMetric ? (
            <div className="flex items-start gap-1.5">
              <Target className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <dt className="sr-only">Primary metric</dt>
              <dd className="leading-snug">{program.primaryMetric}</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <dt className="sr-only">Coverage</dt>
            <dd>{program.lgasCovered > 0 ? `${program.lgasCovered} LGAs covered` : "No LGAs yet"}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 shrink-0" aria-hidden />
            <dt className="sr-only">Activity</dt>
            <dd>{program.activeDays > 0 ? `${program.activeDays} active days` : "Not started"}</dd>
          </div>
        </dl>

        {program.targetCount > 0 ? (
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="grid grid-cols-3 divide-x divide-border text-center">
              <div className="px-1">
                <p className="text-base font-bold tabular-nums leading-tight text-primary sm:text-lg">
                  {program.completionPercent}%
                </p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
              <div className="px-1">
                <p className="text-base font-bold tabular-nums leading-tight sm:text-lg">
                  {compact(program.reachCount)}
                </p>
                <p className="text-xs text-muted-foreground">Reached</p>
              </div>
              <div className="px-1">
                <p className="text-base font-bold tabular-nums leading-tight sm:text-lg">
                  {compact(program.targetCount)}
                </p>
                <p className="text-xs text-muted-foreground">Target</p>
              </div>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", barColor(program.completionPercent))}
                style={{
                  width: `${Math.max(program.completionPercent, program.completionPercent > 0 ? 2 : 0)}%`,
                }}
                role="progressbar"
                aria-valuenow={program.completionPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Completion"
              />
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t pt-3">
          {reports.length > 0 ? (
            <div className="relative z-10 flex min-w-0 flex-wrap gap-2">
              {reports.map((report) => (
                <a
                  key={report.id}
                  href={report.url}
                  download
                  title={report.title}
                  className="inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="size-3.5 shrink-0" aria-hidden />
                  <span className="truncate">
                    Report <span className="font-normal opacity-80">· {report.fileFormat}</span>
                  </span>
                </a>
              ))}
            </div>
          ) : program.status !== "planned" ? (
            <p className="text-xs italic text-muted-foreground">
              Reports appear at 100% completion.
            </p>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View dashboard
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
