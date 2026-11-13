import { unstable_cache } from "next/cache";
import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";

/**
 * Server-side prefetch for public pages. The first data request used to start only
 * after the browser had loaded the page and its scripts, and it opened a new HTTPS
 * connection to the API (about a second on a slow connection). The result is now
 * fetched here, cached for a short time, and handed to the browser inside the page,
 * so the data is already in the React Query cache when the page first renders.
 *
 * It never throws: when the API is slow or down the page is still served and the
 * browser fetches the data itself, exactly as before.
 */
export type PrefetchEntry = {
  /** Same query key the client hook uses, or the browser will not find the data. */
  queryKey: readonly unknown[];
  queryFn: () => Promise<unknown>;
  /** Seconds the server may reuse the answer. */
  revalidate: number;
  /** Mark the data stale so the browser refetches at once (it still paints the data first). */
  refetchOnMount?: boolean;
};

export async function prefetchForClient(
  entries: PrefetchEntry[],
): Promise<DehydratedState> {
  const client = new QueryClient();
  await Promise.all(
    entries.map(async (entry) => {
      try {
        const cached = unstable_cache(
          entry.queryFn,
          [
            "prefetch",
            ...entry.queryKey.map(String),
            JSON.stringify(entry.queryKey),
          ],
          {
            revalidate: entry.revalidate,
          },
        );
        const data = await cached();
        // updatedAt 0 makes the data stale on arrival: shown instantly, refreshed in the background.
        client.setQueryData(
          entry.queryKey,
          data,
          entry.refetchOnMount ? { updatedAt: 0 } : undefined,
        );
      } catch {
        // Leave the query empty; the client fetches it.
      }
    }),
  );
  return dehydrate(client);
}
