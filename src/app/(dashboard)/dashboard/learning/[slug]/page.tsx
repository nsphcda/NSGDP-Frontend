import type { Metadata } from "next";
import { GuidePage } from "@/components/learning/guide-page";
import { getGuideForMetadata } from "@/lib/learning/content-server";

// Guides are edited in the admin portal, so slugs are not known at build time.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideForMetadata(slug);
  return guide ? { title: guide.title, description: guide.summary } : { title: "Learning guide" };
}

export default async function DashboardLearningGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <GuidePage slug={slug} variant="dashboard" />;
}
