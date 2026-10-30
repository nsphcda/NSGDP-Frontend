import { GUIDES } from "./guides";
import type { Guide } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/**
 * Server-side guide lookup for page metadata. Reads the published content API
 * and falls back to the guides that shipped with the portal when the API
 * cannot be reached (or the base URL is relative, as in local rewrites).
 * Kept apart from content.tsx, which is a client module.
 */
export async function getGuideForMetadata(slug: string): Promise<Guide | undefined> {
  if (/^https?:\/\//i.test(API_BASE_URL)) {
    try {
      const res = await fetch(`${API_BASE_URL}/learning/content`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const body = (await res.json()) as { data?: { guides?: Guide[] } };
        if (Array.isArray(body.data?.guides)) {
          return body.data.guides.find((g) => g.slug === slug);
        }
      }
    } catch {
      // fall through to the shipped copy
    }
  }
  return GUIDES.find((g) => g.slug === slug);
}
