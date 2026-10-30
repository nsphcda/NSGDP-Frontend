import type { UserRole } from "@/types";
import type { LearningContent } from "./content";
import type {
  AudienceFilter,
  FaqItem,
  GlossaryTerm,
  Guide,
  LearningAudience,
  LearningPath,
  VideoTutorial,
} from "./types";

export const AUDIENCE_LABEL: Record<LearningAudience, string> = {
  contributor: "Contributor",
  partner_admin: "Partner admin",
  viewer: "Public",
};

export function defaultAudienceForRole(role: UserRole | undefined | null): AudienceFilter {
  if (role === "admin") return "partner_admin";
  if (role === "contributor") return "contributor";
  return "all";
}

export function guideMatchesAudience(guide: Guide, audience: AudienceFilter): boolean {
  return audience === "all" || guide.audience.includes(audience);
}

export function findGuide(guides: Guide[], slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** The path for an audience; "all" (and anything without its own path) falls back to the contributor path, then the first path. */
export function pathForAudience(
  paths: LearningPath[],
  audience: AudienceFilter,
): LearningPath | undefined {
  const want = audience === "all" ? "contributor" : audience;
  return paths.find((p) => p.audience === want) ?? paths[0];
}

/** First guide in the path the reader has not completed yet. */
export function nextGuideInPath(
  path: LearningPath | undefined,
  completed: string[],
  guides: Guide[],
): Guide | undefined {
  const slug = path?.guides.find((s) => !completed.includes(s));
  return slug ? findGuide(guides, slug) : undefined;
}

export function pathProgress(path: LearningPath, completed: string[]) {
  const total = path.guides.length;
  const done = path.guides.filter((s) => completed.includes(s)).length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function remainingMinutes(
  path: LearningPath,
  completed: string[],
  guides: Guide[],
): number {
  return path.guides
    .filter((s) => !completed.includes(s))
    .reduce((sum, s) => sum + (findGuide(guides, s)?.minutes ?? 0), 0);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function learningHref(basePath: string, slug?: string, tab?: string): string {
  if (slug) return `${basePath}/${slug}`;
  return tab ? `${basePath}?tab=${tab}` : basePath;
}

/** Step content hard-codes `/learning/...` links; point them at the current surface. */
export function resolveLearningHref(href: string, basePath: string): string {
  if (href === "/learning" || href.startsWith("/learning/") || href.startsWith("/learning?")) {
    return `${basePath}${href.slice("/learning".length)}`;
  }
  return href;
}

// ── Search ────────────────────────────────────────────────────────────────

export interface LearningSearchResults {
  guides: Guide[];
  videos: VideoTutorial[];
  glossary: GlossaryTerm[];
  faqs: FaqItem[];
  total: number;
}

function normalise(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s]/gu, " ");
}

function scoreText(haystack: string, tokens: string[]): number {
  const text = normalise(haystack);
  let score = 0;
  for (const t of tokens) {
    if (!text.includes(t)) return 0;
    score += 1;
  }
  return score;
}

export function searchLearning(
  content: LearningContent,
  query: string,
  audience: AudienceFilter,
): LearningSearchResults {
  const tokens = normalise(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return { guides: [], videos: [], glossary: [], faqs: [], total: 0 };
  }

  const guides = content.guides.filter((g) => guideMatchesAudience(g, audience))
    .map((g) => {
      const title = scoreText(g.title, tokens) * 5;
      const summary = scoreText(g.summary, tokens) * 3;
      const body = scoreText(
        [...g.outcomes, ...g.steps.map((s) => `${s.title} ${s.body}`)].join(" "),
        tokens,
      );
      return { g, score: title + summary + body };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.g);

  const videos = content.videos.filter(
    (v) => scoreText(`${v.title} ${v.description} ${(v.chapters ?? []).map((c) => c.label).join(" ")}`, tokens) > 0,
  );
  const glossary = content.glossary.filter((t) => scoreText(`${t.term} ${t.definition}`, tokens) > 0);
  const faqs = content.faqs.filter((f) => scoreText(`${f.question} ${f.answer}`, tokens) > 0);

  return {
    guides,
    videos,
    glossary,
    faqs,
    total: guides.length + videos.length + glossary.length + faqs.length,
  };
}
