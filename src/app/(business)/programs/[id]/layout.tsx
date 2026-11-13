import type { Metadata } from "next";
import { fetchPublicJson, toMetaDescription } from "@/lib/seo/server-fetch";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchPublicJson<{ title?: string; name?: string; description?: string }>(`/programs/${encodeURIComponent(id)}`);
  const title = item?.title ?? item?.name;
  if (!title) return {};
  const description = toMetaDescription(item?.description);
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
