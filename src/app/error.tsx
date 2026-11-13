"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";

const RELOAD_FLAG = "nsgdp-chunk-reload";

/** Errors a page throws when the browser holds an old build whose script files were replaced by a deploy. */
function isStaleBuildError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    /loading chunk|failed to fetch dynamically imported module|importing a module script failed/i.test(
      error.message,
    )
  );
}

/**
 * Catches errors while a page renders, so a failure shows a clear message instead
 * of a blank "Application error" screen. After a deploy, a browser that still holds
 * the old build can fail to load a script that no longer exists: that case reloads
 * the page once, which fetches the new build.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const stale = isStaleBuildError(error);

  useEffect(() => {
    if (!stale) return;
    try {
      if (sessionStorage.getItem(RELOAD_FLAG)) return;
      sessionStorage.setItem(RELOAD_FLAG, "1");
    } catch {
      // Storage is blocked, so a reload loop could not be prevented: show the message.
      return;
    }
    window.location.reload();
  }, [stale]);

  return (
    <main className="flex min-h-[60dvh] flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight">This page could not be shown</h1>
        <p className="mt-3 text-muted-foreground">
          {stale
            ? "The portal was updated while this page was open. Reload to get the latest version."
            : "Something went wrong while loading this page. Trying again usually fixes it."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => (stale ? window.location.reload() : reset())}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RotateCw className="size-4" aria-hidden />
            {stale ? "Reload" : "Try again"}
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Go to the home page
          </Link>
        </div>
      </div>
    </main>
  );
}
