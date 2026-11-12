"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { useDatasets } from "@/lib/hooks/useDatasets";
import { useGroups } from "@/lib/hooks/useGroups";
import { formatDate } from "@/lib/utils/date";
import { DISPLAY_SM, DISPLAY_XL } from "./home-fonts";
import { Reveal } from "./reveal";

const textLink =
  "inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline";

/**
 * Layout family: dual list. Live catalogue data, ranked, beside curated
 * collections. When there are no featured collections the dataset list takes
 * the full width. Data rules are unchanged from the previous home page.
 */
export function DatasetsAndCollections() {
  const { data: datasetsData, isLoading: datasetsLoading } = useDatasets({
    catalogue: true,
    status: "approved",
    published: true,
    sortBy: "download_count",
    sortOrder: "DESC",
    limit: 4,
  });
  const { data: groupsData } = useGroups({ featured: true, limit: 3 });

  // Development partner names are deliberately not resolved here: that endpoint
  // requires auth, and this section must stay visible to logged-out visitors.
  const topDatasets = (datasetsData?.data ?? []).filter(
    (dataset) =>
      dataset.status === "approved" &&
      !!dataset.published_at &&
      dataset.visibility !== "private",
  );
  const groups = groupsData?.data ?? [];
  const hasGroups = groups.length > 0;

  return (
    <section className="py-20 sm:py-28">
      <Container
        size="wide"
        className="grid grid-cols-1 gap-14 px-4 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:px-8"
      >
        <Reveal className={hasGroups ? "lg:col-span-3" : "lg:col-span-5"}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                className={`${DISPLAY_XL} text-3xl font-bold sm:text-4xl`}
              >
                Most downloaded datasets
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Live catalogue from published NSPHCDA datasets
              </p>
            </div>
            <Link href="/dataportal" className={textLink}>
              Browse all datasets
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          {datasetsLoading ? (
            <ul className="mt-8 divide-y border-y" aria-label="Loading datasets">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-5 py-5">
                  <span className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                  <span className="h-5 flex-1 animate-pulse rounded-md bg-muted" />
                </li>
              ))}
            </ul>
          ) : topDatasets.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed p-8 sm:p-10">
              <p className={`${DISPLAY_SM} text-xl font-semibold`}>
                No datasets are published yet
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Datasets appear here once they have been reviewed. Partners can submit
                data for review and publication.
              </p>
              <Link href="/partner-data" className={`${textLink} mt-5`}>
                Contribute data
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <ol className="mt-8 divide-y border-y">
              {topDatasets.map((item, i) => (
                <li key={item.id}>
                  <Link
                    href={`/dataportal/${item.slug}`}
                    className="group flex items-center gap-5 py-5 transition-colors hover:bg-muted/50 sm:px-3 lg:-mx-3"
                  >
                    <span
                      className={`${DISPLAY_XL} w-8 shrink-0 text-3xl font-bold tabular-nums text-muted-foreground/40`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-medium group-hover:text-primary">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        Updated {formatDate(item.updated_at)}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Reveal>

        {hasGroups ? (
          <Reveal className="lg:col-span-2" delay={120}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  className={`${DISPLAY_XL} text-3xl font-bold sm:text-4xl`}
                >
                  Featured collections
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Curated topic collections of datasets and documents
                </p>
              </div>
              <Link href="/groups" className={textLink}>
                Browse all topics
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <ul className="mt-8 divide-y border-y">
              {groups.map((group) => (
                <li key={group.id}>
                  <Link
                    href={`/groups/${group.slug}`}
                    className="group block py-5 transition-colors hover:bg-muted/50 sm:px-3 lg:-mx-3"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span
                        className={`${DISPLAY_SM} text-lg font-semibold group-hover:text-primary`}
                      >
                        {group.name}
                      </span>
                      <Star
                        className="mt-1 size-4 shrink-0 text-warning"
                        fill="currentColor"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">
                      {group.description}
                    </span>
                    <span className="mt-2 block text-xs font-medium text-muted-foreground">
                      {group.datasetCount} dataset{group.datasetCount !== 1 ? "s" : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
