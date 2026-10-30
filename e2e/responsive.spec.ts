import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { audit } from "./audit";
import { discoverParams, discoverRoutes, resolveRoute } from "./routes";

/**
 * Loads every page in src/app at several phone/tablet sizes and checks it for
 * layout problems. Hard failures: the page scrolls sideways, content spills
 * past the screen edge, the page crashes, or the viewport meta is missing.
 * Soft findings (reported, not failing): small tap targets, tiny text,
 * console errors, failed API calls.
 *
 * Env: BASE_URL, API_URL, VIEWPORTS=375x667,412x915, ROUTES=/a,/b,
 *      AUTH_STATE=e2e/.auth/user.json, E2E_PARAMS='{"/my-programs/[slug]":"x"}',
 *      STRICT=0 (make hard failures soft), MIN_TAP=44 (px), SCREENSHOTS=0.
 */

const VIEWPORTS = (process.env.VIEWPORTS ?? "320x640,375x667,412x915,768x1024")
  .split(",")
  .map((v) => {
    const [width, height] = v.trim().split("x").map(Number);
    return { name: `${width}x${height}`, width, height };
  });

const ONLY_ROUTES = process.env.ROUTES?.split(",").map((r) => r.trim()).filter(Boolean);
const AUTH_STATE = process.env.AUTH_STATE ?? join(__dirname, ".auth", "user.json");
const HAS_AUTH = existsSync(AUTH_STATE);
const STRICT = process.env.STRICT !== "0";
// WCAG 2.2 AA asks for 24px, Apple 44pt, Material 48dp. 40px is the practical floor used here.
const MIN_TAP = Number(process.env.MIN_TAP ?? 40);
const SCREENSHOTS = process.env.SCREENSHOTS !== "0";
const API_URL =
  process.env.API_URL ??
  (/^https?:\/\//.test(process.env.NEXT_PUBLIC_API_URL ?? "") ? process.env.NEXT_PUBLIC_API_URL : undefined) ??
  "http://localhost:3001/api/v1";
const OVERRIDES: Record<string, string> = process.env.E2E_PARAMS
  ? JSON.parse(process.env.E2E_PARAMS)
  : {};

let paramsPromise: Promise<Record<string, string>> | null = null;
const discovered = () => (paramsPromise ??= discoverParams(API_URL));

interface Finding {
  type: string;
  severity: "fail" | "warn";
  detail: string;
}

const routes = discoverRoutes().filter(
  (r) =>
    !ONLY_ROUTES ||
    ONLY_ROUTES.some((o) => r.template === o || (o !== "/" && r.template.startsWith(`${o}/`))),
);

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name}`, () => {
    test.use({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.width < 600,
      hasTouch: true,
      deviceScaleFactor: 2,
      storageState: HAS_AUTH ? AUTH_STATE : undefined,
    });

    for (const route of routes) {
      test(`${route.template}`, async ({ page }, testInfo) => {
        const resolved = resolveRoute(route, await discovered(), OVERRIDES);
        if (!resolved) {
          testInfo.annotations.push({
            type: "skipped",
            description: `no sample value for ${route.params.join(", ")} (set E2E_PARAMS or start the API)`,
          });
          test.skip(true, "dynamic route without sample data");
          return;
        }
        if (route.requiresAuth && !HAS_AUTH) {
          testInfo.annotations.push({
            type: "skipped",
            description: "needs a signed-in session: run `npm run e2e:login` first",
          });
          test.skip(true, "authenticated route without AUTH_STATE");
          return;
        }

        const findings: Finding[] = [];
        const add = (f: Finding) => {
          findings.push(f);
          testInfo.annotations.push({
            type: `${f.severity}:${f.type}`,
            description: f.detail,
          });
        };

        const pageErrors: string[] = [];
        const consoleErrors: string[] = [];
        const badResponses: string[] = [];
        page.on("pageerror", (e) => pageErrors.push(e.message.slice(0, 200)));
        page.on("console", (m) => {
          if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
        });
        page.on("response", (r) => {
          if (r.status() >= 500) badResponses.push(`${r.status()} ${new URL(r.url()).pathname}`);
        });

        const response = await page.goto(resolved, { waitUntil: "domcontentloaded" });
        // Let client data and images settle, but never wait forever on polling pages.
        await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
        await page.waitForTimeout(500);

        const status = response?.status() ?? 0;
        if (status >= 500) add({ type: "http-error", severity: "fail", detail: `HTTP ${status}` });
        if (status === 404) add({ type: "not-found", severity: "warn", detail: "page returned 404 (sample data missing?)" });

        // Redirected to login: the session is missing or expired.
        if (route.requiresAuth && /\/login/.test(new URL(page.url()).pathname)) {
          add({
            type: "auth-redirect",
            severity: "fail",
            detail: "redirected to /login: saved session expired, run `npm run e2e:login` again",
          });
        }

        const a = await audit(page, MIN_TAP);

        if (!a.hasViewportMeta) {
          add({ type: "viewport-meta", severity: "fail", detail: "no <meta name=viewport>" });
        }
        if (a.scrollWidth > a.vw + 1) {
          add({
            type: "horizontal-scroll",
            severity: "fail",
            detail: `page is ${a.scrollWidth}px wide on a ${a.vw}px screen; widest: ${a.overflowing
              .slice(0, 3)
              .map((o) => `${o.s} (right edge ${o.right}px)`)
              .join(", ")}`,
          });
        } else if (a.overflowCount > 0) {
          add({
            type: "clipped-content",
            severity: "fail",
            detail: `${a.overflowCount} element(s) extend past the ${a.vw}px screen but are hidden by overflow: ${a.overflowing
              .slice(0, 3)
              .map((o) => `${o.s} (right edge ${o.right}px)`)
              .join(", ")}`,
          });
        }
        if (a.tinyCount > 0) {
          add({
            type: "small-tap-target",
            severity: "warn",
            detail: `${a.tinyCount} control(s) under ${MIN_TAP}px, e.g. ${a.tiny.slice(0, 4).join("; ")}`,
          });
        }
        if (a.smallTextCount > 0) {
          add({
            type: "small-text",
            severity: "warn",
            detail: `${a.smallTextCount} text element(s) under 12px, e.g. ${a.smallText
              .map((t) => `${t.s} ${t.px}px`)
              .join("; ")}`,
          });
        }
        if (a.zoomInputCount > 0) {
          add({
            type: "input-zoom",
            severity: "warn",
            detail: `${a.zoomInputCount} field(s) under 16px zoom the page on iPhone focus, e.g. ${a.zoomInputs.slice(0, 3).join("; ")}`,
          });
        }
        if (pageErrors.length > 0) {
          add({ type: "page-error", severity: "fail", detail: pageErrors.slice(0, 3).join(" | ") });
        }
        if (badResponses.length > 0) {
          add({ type: "api-5xx", severity: "warn", detail: [...new Set(badResponses)].slice(0, 4).join(", ") });
        }
        if (consoleErrors.length > 0) {
          add({ type: "console-error", severity: "warn", detail: `${consoleErrors.length}: ${consoleErrors[0]}` });
        }

        if (SCREENSHOTS) {
          const dir = join(__dirname, "results", "screens", vp.name);
          mkdirSync(dir, { recursive: true });
          const file = join(dir, `${route.template.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home"}.png`);
          await page.screenshot({ path: file, fullPage: true }).catch(() => undefined);
          testInfo.annotations.push({ type: "screenshot", description: file });
        }

        const hard = findings.filter((f) => f.severity === "fail");
        if (STRICT) {
          expect(hard, hard.map((f) => `${f.type}: ${f.detail}`).join("\n")).toEqual([]);
        }
      });
    }
  });
}
