import { HydrationBoundary } from "@tanstack/react-query";
import { Container } from "@/components/layout/container";
import { getPlatformStatistics } from "@/lib/api/stats";
import { prefetchForClient } from "@/lib/server/prefetch";
import { LiveOutbreakAlerts } from "@/components/home/live-outbreak-alerts";
import { HomeHero, HomeStats } from "@/components/home/home-hero";
import { ExploreSection } from "@/components/home/explore-section";
import { MapsBento } from "@/components/home/maps-bento";
import { DataUseBand } from "@/components/home/data-use-band";
import { DatasetsAndCollections } from "@/components/home/datasets-and-collections";
import { TrustAndPartners } from "@/components/home/trust-and-partners";
import { ClosingCta } from "@/components/home/closing-cta";

/**
 * Home page. Section order and the layout family of each:
 *   hero (asymmetric photo) > stats (overlapping strip) > alerts (when active)
 *   > explore (sticky split) > maps (bento) > data use (dark band)
 *   > datasets + collections (dual list) > trust + partners (logo wall)
 *   > closing call to action.
 * All content, links and data hooks are carried over from the previous page.
 */
export const revalidate = 60;

export default async function HomePage() {
  // The live numbers arrive with the page instead of after a separate browser request.
  const state = await prefetchForClient([
    {
      queryKey: ["statistics"],
      queryFn: getPlatformStatistics,
      revalidate: 60,
    },
  ]);
  return (
    <HydrationBoundary state={state}>
      <main className="flex-1">
        <HomeHero />
        <HomeStats />

        {/* Renders nothing when there are no active alerts, so no gap is left. */}
        <Container
          size="wide"
          className="px-4 pt-8 empty:hidden sm:px-6 lg:px-8"
        >
          <LiveOutbreakAlerts />
        </Container>

        <ExploreSection />
        <MapsBento />
        <DataUseBand />
        <DatasetsAndCollections />
        <TrustAndPartners />
        <ClosingCta />
      </main>
    </HydrationBoundary>
  );
}
