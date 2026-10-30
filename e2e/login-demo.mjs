#!/usr/bin/env node
/**
 * Signs in headlessly as each demo account and saves its session, so the
 * signed-in pages can be audited without manual steps.
 *
 *   (backend) npm run seed:demo
 *   (frontend) npm run e2e:login:demo
 *
 * Writes e2e/.auth/<role>.json. The audit uses user.json by default
 * (contributor). Set AUTH_STATE=e2e/.auth/partner-admin.json for the team pages.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3004";
const password = process.env.DEMO_PASSWORD ?? "Demo@Portal2026!";
const authDir = join(dirname(fileURLToPath(import.meta.url)), ".auth");
mkdirSync(authDir, { recursive: true });

const ACCOUNTS = [
  { file: "contributor.json", email: "demo.contributor@example.org" },
  { file: "partner-admin.json", email: "demo.partner-admin@example.org" },
  { file: "viewer.json", email: "demo.viewer@example.org" },
];

const browser = await chromium.launch(
  process.env.PW_DISABLE_CORS ? { args: ["--disable-web-security"] } : {},
);
let failed = 0;
for (const a of ACCOUNTS) {
  const context = await browser.newContext({ viewport: { width: 1100, height: 800 } });
  const page = await context.newPage();
  try {
    // In dev mode the page can be clickable before React has hydrated; a click
    // then submits the form natively (GET /login?email=...) instead of logging
    // in. Detect that and retry once the JS has loaded.
    for (let attempt = 1; ; attempt++) {
      await page.goto(`${baseURL}/login`, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);
      await page.waitForTimeout(1500);
      await page.fill("#email", a.email);
      await page.fill("#password", password);
      await page.getByRole("button", { name: /^log in$/i }).click();
      const left = await page
        .waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 20_000 })
        .then(() => true)
        .catch(() => false);
      if (left) break;
      if (attempt >= 3) throw new Error("login form did not submit (check the API is reachable)");
    }
    await page.waitForTimeout(1500); // let the app write its tokens
    await context.storageState({ path: join(authDir, a.file) });
    console.log(`OK    ${a.email} -> ${a.file}`);
  } catch (e) {
    failed++;
    console.error(`FAIL  ${a.email}: ${e.message.split("\n")[0]}`);
  } finally {
    await context.close();
  }
}
await browser.close();

// The audit's default session is the contributor.
try {
  copyFileSync(join(authDir, "contributor.json"), join(authDir, "user.json"));
} catch {
  /* contributor login failed */
}
process.exit(failed ? 1 : 0);
