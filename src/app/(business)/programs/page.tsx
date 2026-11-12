"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/home/reveal";
import { DISPLAY_XL } from "@/components/home/home-fonts";
import { ProgramCard, PROGRAM_TYPE_LABELS } from "@/components/programs/program-card";
import { usePrograms } from "@/lib/hooks/usePrograms";
import type { ProgramStatus, ProgramType } from "@/types";
import { cn } from "@/lib/utils";

const ALL_TYPES = Object.keys(PROGRAM_TYPE_LABELS) as ProgramType[];
const STATUS_RANK: Record<ProgramStatus, number> = { ongoing: 0, completed: 1, planned: 2 };
const STATUSES: Array<ProgramStatus | "all"> = ["all", "ongoing", "completed", "planned"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-white bg-white text-[#0D3B14]"
          : "border-white/20 bg-white/5 text-white/85 hover:bg-white/15",
      )}
    >
      {children}
    </button>
  );
}

export default function ProgramsPage() {
  const { data, isLoading, error } = usePrograms();
  const programs = useMemo(() => data?.data ?? [], [data]);

  const [statusFilter, setStatusFilter] = useState<ProgramStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ProgramType | "all">("all");

  // Live work first, then finished, then upcoming; photos break ties.
  const filtered = useMemo(
    () =>
      programs
        .filter(
          (p) =>
            (statusFilter === "all" || p.status === statusFilter) &&
            (typeFilter === "all" || p.type === typeFilter),
        )
        .sort(
          (a, b) =>
            STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
            Number(!!b.coverImage) - Number(!!a.coverImage),
        ),
    [programs, statusFilter, typeFilter],
  );

  // Only offer types that exist, so no filter leads to an empty page.
  const presentTypes = useMemo(
    () => ALL_TYPES.filter((t) => programs.some((p) => p.type === t)),
    [programs],
  );

  const stats = useMemo(
    () => ({
      total: programs.length,
      ongoing: programs.filter((p) => p.status === "ongoing").length,
      completed: programs.filter((p) => p.status === "completed").length,
      planned: programs.filter((p) => p.status === "planned").length,
    }),
    [programs],
  );

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
        <Container size="wide" className="px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-14 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-teal">Programs</p>
              <h1 className={cn("mt-3 text-4xl font-bold sm:text-5xl", DISPLAY_XL)}>
                Health programs
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
                Vaccination, surveillance, screening, training and research across Niger State.
                Open a programme for its photos, progress and final reports.
              </p>
            </div>
            {programs.length > 0 ? (
              <dl className="grid grid-cols-4 divide-x divide-white/15 self-start rounded-xl border border-white/15 bg-white/5 text-center lg:self-auto">
                {[
                  { label: "Total", value: stats.total },
                  { label: "Ongoing", value: stats.ongoing },
                  { label: "Completed", value: stats.completed },
                  { label: "Planned", value: stats.planned },
                ].map((item) => (
                  <div key={item.label} className="px-3 py-3 sm:px-5">
                    <dd className="text-2xl font-bold tabular-nums leading-none sm:text-3xl">
                      {item.value}
                    </dd>
                    <dt className="mt-1 text-[11px] text-white/70 sm:text-xs">{item.label}</dt>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <div className="mt-7 space-y-2.5">
            <div
              role="group"
              aria-label="Filter by status"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            >
              {STATUSES.map((st) => (
                <Chip key={st} active={statusFilter === st} onClick={() => setStatusFilter(st)}>
                  {st === "all" ? "All" : st.charAt(0).toUpperCase() + st.slice(1)}
                </Chip>
              ))}
            </div>
            {presentTypes.length > 1 ? (
              <div
                role="group"
                aria-label="Filter by type"
                className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
              >
                <Chip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
                  All types
                </Chip>
                {presentTypes.map((t) => (
                  <Chip key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
                    {PROGRAM_TYPE_LABELS[t]}
                  </Chip>
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12 lg:py-16">
        <Container size="wide">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
              {[0, 1, 2].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border">
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="space-y-2 p-5">
                    <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border bg-muted/30 py-20 text-center text-muted-foreground">
              Couldn&apos;t load programmes. Please try again shortly.
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border bg-muted/30 py-20 text-center text-muted-foreground">
              {programs.length === 0
                ? "No programmes have been published yet."
                : "No programmes match the selected filters."}
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-muted-foreground">
                {filtered.length} of {programs.length} programmes
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {filtered.map((program, index) => (
                  <Reveal
                    key={program.id}
                    delay={(index % 3) * 60}
                    className={cn(
                      "flex",
                      index === 0 && filtered.length > 2 && "lg:col-span-2",
                    )}
                  >
                    <ProgramCard
                      program={program}
                      featured={index === 0 && filtered.length > 2}
                      className="w-full"
                    />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </main>
  );
}
