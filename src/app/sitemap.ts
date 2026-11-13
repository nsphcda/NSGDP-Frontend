import type { MetadataRoute } from "next";
import { fetchPublicJson } from "@/lib/seo/server-fetch";

const SITE = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://nsphcda-data.nigerstate.gov.ng"
).replace(/\/$/, "");

const PAGES = [
  "/",
  "/about",
  "/analytics",
  "/contact",
  "/dataportal",
  "/development-partners",
  "/documents",
  "/facilities",
  "/groups",
  "/learning",
  "/map",
  "/population-map",
  "/privacy",
  "/programs",
  "/settlements",
  "/terms",
];

type DatasetList =
  | { data?: Array<{ slug: string; updated_at?: string }> }
  | Array<{ slug: string; updated_at?: string }>;

/** Public pages plus every public dataset, so search engines find them without crawling. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const list = await fetchPublicJson<DatasetList>(
    "/datasets?limit=100&visibility=public",
  );
  const datasets = Array.isArray(list) ? list : (list?.data ?? []);
  return [
    ...PAGES.map((path) => ({ url: `${SITE}${path}` })),
    ...datasets.map((d) => ({
      url: `${SITE}/dataportal/${d.slug}`,
      lastModified: d.updated_at ? new Date(d.updated_at) : undefined,
    })),
  ];
}
