/**
 * Server-side read of a public API resource for page titles and the sitemap.
 * Returns null on any failure so a slow or unreachable API never breaks a page:
 * the page then keeps its section title. Only absolute API URLs work here; a
 * relative "/api" base (local proxy) has no server-side origin.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchPublicJson<T = unknown>(
  path: string,
): Promise<T | null> {
  if (!/^https?:\/\//.test(API_BASE)) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: T };
    return body.data ?? null;
  } catch {
    return null;
  }
}

/** One-line description for a meta tag: plain text, no more than ~160 characters. */
export function toMetaDescription(
  text: string | null | undefined,
): string | undefined {
  if (!text) return undefined;
  const plain = text.replace(/\s+/g, " ").trim();
  if (!plain) return undefined;
  return plain.length > 160 ? `${plain.slice(0, 157).trimEnd()}...` : plain;
}
