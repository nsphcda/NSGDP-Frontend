"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/constants/brand";
import { useStatistics } from "@/lib/hooks/useStatistics";
import { DISPLAY_XL } from "./home-fonts";

/**
 * Asymmetric hero: copy and search on the left over a deep green wash, the
 * illustration showing through on the right. The search box is the primary
 * action; "Browse repository" is the single secondary one.
 */
export function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#0D3B14] text-white">
      <Image
        src={BRAND.heroImagePath}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[72%_center]"
        aria-hidden
      />
      {/* Green wash: solid behind the copy, fading out so the artwork reads on the right. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0D3B14]/90 via-[#0D3B14]/55 to-transparent max-md:from-[#0D3B14]/85 max-md:via-[#0D3B14]/70 max-md:to-[#0D3B14]/55"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-black/45 to-transparent"
        aria-hidden
      />
      {/* Sits behind the transparent header so white nav text stays readable. */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/50 to-transparent"
        aria-hidden
      />

      <Container
        size="wide"
        className="flex min-h-[min(88dvh,760px)] items-center px-4 pb-32 pt-28 sm:px-6 sm:pt-36 lg:px-8"
      >
        <div className="max-w-2xl">
          {/* One line from 1024px up (about 800px wide at this size); wraps naturally below that. */}
          <p className="home-rise max-w-xl text-lg font-medium leading-snug text-white/70 [text-shadow:0_1px_20px_rgba(0,0,0,0.4)] sm:text-xl lg:max-w-none lg:whitespace-nowrap">
            Welcome to <span className="text-white">Niger State</span> Primary Health Care{" "}
            <span className="text-teal">Development Agency&apos;s</span>
          </p>
          <h1
            className={`${DISPLAY_XL} home-rise home-rise-1 mt-3 text-4xl font-bold [text-shadow:0_2px_28px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl`}
          >
            Health &amp; Geospatial Data Portal
          </h1>
          <p className="home-rise home-rise-2 mt-5 max-w-xl text-base leading-relaxed text-white/90 [text-shadow:0_1px_20px_rgba(0,0,0,0.4)] sm:text-lg">
            Centralised geospatial health data for evidence-based planning, disease
            surveillance, and equitable service delivery across all 25 Local Government
            Areas.
          </p>

          <div className="home-rise home-rise-3 mt-8 max-w-xl space-y-3">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  className="hero-input-icon pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2"
                  aria-hidden
                />
                <Input
                  type="search"
                  surface="hero"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search datasets by keyword, region, or topic"
                  className="h-12 pl-11 text-base md:text-sm"
                  aria-label="Search datasets"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                variant="onDarkSolid"
                className="h-12 px-7 text-base text-[#0D3B14]"
              >
                Search
              </Button>
            </form>
            <Link href="/dataportal" className="inline-block">
              <Button size="lg" variant="onDark" className="h-11 px-5 text-base">
                Browse repository
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Live platform numbers, set in a single surface that overlaps the bottom of
 * the hero. Hairlines separate the figures; there are no individual cards.
 */
export function HomeStats() {
  const { data: stats, isLoading } = useStatistics();

  const items = [
    { value: stats?.datasets, label: "Active datasets" },
    {
      value: stats?.developmentPartners ?? stats?.organisations,
      label: "Development Partners",
    },
    {
      value: stats?.downloads != null ? stats.downloads.toLocaleString() : undefined,
      label: "Downloads",
    },
    { value: stats?.lgasCovered, label: "LGAs covered" },
  ];

  return (
    <Container
      size="wide"
      className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8"
    >
      <dl className="grid grid-cols-2 divide-border overflow-hidden rounded-2xl border bg-card shadow-[0_24px_60px_-28px_rgba(13,59,20,0.45)] lg:grid-cols-4 lg:divide-x">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`px-6 py-6 sm:px-8 sm:py-7 ${i % 2 === 1 ? "border-l lg:border-l-0" : ""} ${
              i > 1 ? "border-t lg:border-t-0" : ""
            }`}
          >
            <dd
              className={`${DISPLAY_XL} text-4xl font-bold tabular-nums text-primary sm:text-5xl`}
            >
              {isLoading ? (
                <span
                  className="inline-block h-10 w-16 animate-pulse rounded-md bg-muted align-middle"
                  aria-label="Loading"
                />
              ) : (
                (item.value ?? "n/a")
              )}
            </dd>
            <dt className="mt-1.5 text-sm font-medium text-muted-foreground">
              {item.label}
            </dt>
          </div>
        ))}
      </dl>
    </Container>
  );
}
