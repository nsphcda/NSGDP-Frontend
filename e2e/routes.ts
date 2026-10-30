import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export interface PageRoute {
  /** Route template, e.g. /dataportal/[slug] */
  template: string;
  /** Param names in order of appearance. */
  params: string[];
  /** Lives under the (dashboard) group, so it needs a signed-in session. */
  requiresAuth: boolean;
  file: string;
}

const APP_DIR = join(__dirname, "..", "src", "app");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name === "page.tsx") out.push(full);
  }
  return out;
}

/**
 * Every page.tsx under src/app, converted to a URL template. Discovered at
 * run time so new pages are covered without editing this file.
 */
export function discoverRoutes(): PageRoute[] {
  return walk(APP_DIR)
    .map((file) => {
      const segments = relative(APP_DIR, file).split(sep).slice(0, -1);
      const requiresAuth = segments.includes("(dashboard)");
      const params: string[] = [];
      const url = segments
        .filter((s) => !(s.startsWith("(") && s.endsWith(")"))) // route groups
        .flatMap((s) => {
          if (s.startsWith("[[...")) return []; // optional catch-all: base path only
          if (s.startsWith("[")) {
            const name = s.replace(/[[\]./]/g, "");
            params.push(name);
            return [s];
          }
          return [s];
        })
        .join("/");
      return { template: `/${url}`, params, requiresAuth, file: relative(APP_DIR, file) };
    })
    .sort((a, b) => a.template.localeCompare(b.template));
}

/** Param value per route template (e.g. "/dataportal/[slug]" -> a real slug), found through the public API when reachable. */
export async function discoverParams(
  apiUrl: string | undefined,
): Promise<Record<string, string>> {
  const found: Record<string, string> = {
    "/reset-password/[token]": "sample-reset-token", // renders the form without a valid token
  };
  if (!apiUrl) return found;

  const get = async (path: string): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      const res = await fetch(`${apiUrl}${path}`, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return null;
      const body = await res.json();
      return body?.data ?? body;
    } catch {
      return null;
    }
  };
  const first = (payload: any) => (payload?.data ?? payload)?.[0]; // eslint-disable-line @typescript-eslint/no-explicit-any

  const [datasets, partners, groups, programs, documents, learning] = await Promise.all([
    get("/datasets?limit=1&catalogue=true"),
    get("/development-partners?limit=1"),
    get("/groups?limit=1"),
    get("/programs?limit=50"),
    get("/documents?limit=1"),
    get("/learning/content"),
  ]);

  const set = (key: string, value: unknown) => {
    if (typeof value === "string" && value) found[key] ??= value;
  };
  set("/dataportal/[slug]", first(datasets)?.slug);
  set("/datasets/[slug]", first(datasets)?.slug);
  set("/edit/[slug]", first(datasets)?.slug);
  set("/development-partners/[slug]", first(partners)?.slug);
  set("/groups/[slug]", first(groups)?.slug);
  set("/programs/[id]", first(programs)?.slug);
  // The signed-in My Programmes pages belong to the demo organisation when it exists
  // (npm run seed:demo), otherwise any programme.
  const programmeList: Array<{ slug?: string }> = (programs?.data ?? programs) ?? [];
  const mine = programmeList.find((p) => p.slug === "demo-measles-campaign")?.slug ?? first(programs)?.slug;
  set("/my-programs/[slug]", mine);
  set("/my-programs/[slug]/edit", mine);
  set("/my-programs/[slug]/upload", mine);
  set("/dashboard/documents/[slug]", first(documents)?.slug);
  set("/learning/[slug]", learning?.guides?.[0]?.slug);
  set("/dashboard/learning/[slug]", learning?.guides?.[0]?.slug);
  return found;
}

/**
 * Fill a template's param. `overrides` (E2E_PARAMS env) win over discovered
 * values. Returns null when a param cannot be resolved so the route is
 * reported as skipped rather than silently dropped.
 */
export function resolveRoute(
  route: PageRoute,
  discovered: Record<string, string>,
  overrides: Record<string, string>,
): string | null {
  if (route.params.length === 0) return route.template;
  const value = overrides[route.template] ?? discovered[route.template];
  if (!value) return null;
  return route.template.replace(/\[[^\]]+\]/, encodeURIComponent(value));
}
