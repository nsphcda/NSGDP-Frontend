import { HydrationBoundary } from "@tanstack/react-query";
import { getDatasets, type DatasetListParams } from "@/lib/api/datasets";
import { getCategories } from "@/lib/api/categories";
import { getDevelopmentPartners } from "@/lib/api/development-partners";
import { prefetchForClient } from "@/lib/server/prefetch";
import { DataportalClient } from "./dataportal-client";

export const revalidate = 60;

/**
 * The first screen of the catalogue (newest first, no filters), fetched on the server.
 * The query keys and parameters must match what dataportal-client.tsx builds for its
 * default state; if they drift the browser simply fetches as before.
 */
const DEFAULT_PARAMS: DatasetListParams = {
  page: 1,
  limit: 20,
  catalogue: true,
  status: "approved",
  published: true,
  sortBy: "created_at",
  sortOrder: "DESC",
};

export default async function DataportalPage() {
  const state = await prefetchForClient([
    {
      queryKey: ["datasets", DEFAULT_PARAMS],
      queryFn: () => getDatasets(DEFAULT_PARAMS),
      revalidate: 60,
      // A signed-in visitor may see more than an anonymous one: show this, then refresh.
      refetchOnMount: true,
    },
    {
      queryKey: ["categories"],
      queryFn: () => getCategories(),
      revalidate: 600,
    },
    {
      queryKey: ["developmentPartners", 1, 100],
      queryFn: () => getDevelopmentPartners({ page: 1, limit: 100 }),
      revalidate: 600,
    },
  ]);
  return (
    <HydrationBoundary state={state}>
      <DataportalClient />
    </HydrationBoundary>
  );
}
