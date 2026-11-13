import type { Metadata } from "next";
import { fetchPublicJson, toMetaDescription } from "@/lib/seo/server-fetch";

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchPublicJson<{ developmentPartner?: { name?: string; description?: string } }>(`/development-partners/${encodeURIComponent(slug)}`);
  const title = item?.developmentPartner?.name;
  if (!title) return {};
  const description = toMetaDescription(item?.developmentPartner?.description);
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default function Layout({ children }: Pick<Props, "children">) {
  return children;
}
