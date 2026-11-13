"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

/** Search box and buttons for the 404 page. */
export function NotFoundActions() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="mt-8 space-y-5">
      <form onSubmit={submit} role="search" className="flex max-w-xl gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the portal…"
            aria-label="Search the portal"
            className="h-12 w-full rounded-full border-0 bg-white pl-11 pr-4 text-base text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/70"
          />
        </div>
        <button
          type="submit"
          className="h-12 shrink-0 rounded-full bg-white px-6 text-sm font-semibold text-[#0D3B14] transition-colors hover:bg-white/90"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal px-5 text-sm font-semibold text-[#0D3B14] transition-colors hover:bg-teal/90"
        >
          <Home className="size-4" aria-hidden />
          Go to the home page
        </Link>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Go back
        </button>
      </div>
    </div>
  );
}
