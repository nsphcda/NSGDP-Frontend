import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";

/**
 * Agency creates a programme and assigns a development partner in the admin
 * portal; the partner's users then see it in the portal and can update progress,
 * but cannot create or archive programmes.
 *
 * Needs the demo accounts (npm run seed:demo in the backend, then
 * npm run e2e:login:demo) and the admin credentials:
 *
 *   ADMIN_URL=http://localhost:3003 API_URL=http://localhost:3001/api/v1 \
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... PW_NO_SERVER=1 \
 *   npx playwright test e2e/programme-partners.spec.ts
 */
const ADMIN_URL = process.env.ADMIN_URL ?? "http://localhost:3003";
const API_URL = process.env.API_URL ?? "http://localhost:3001/api/v1";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const CONTRIBUTOR_STATE = join(__dirname, ".auth", "contributor.json");
const PARTNER = "Demo Health Partners";

test.skip(
  !ADMIN_EMAIL || !ADMIN_PASSWORD || !existsSync(CONTRIBUTOR_STATE),
  "needs ADMIN_EMAIL/ADMIN_PASSWORD and the demo sessions (npm run e2e:login:demo)",
);

async function adminToken(): Promise<string> {
  const res = await fetch(`${API_URL}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  return (await res.json()).data.accessToken;
}

async function api(path: string, token: string, init: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return { status: res.status, body: res.status === 204 ? null : await res.json() };
}

async function hydrated(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => undefined);
  await page.waitForTimeout(800);
}

test.describe.configure({ mode: "serial" });

test.describe("programme partners", () => {
  const name = `UI Test Programme ${Date.now()}`;
  let slug = "";
  let token = "";

  test.beforeAll(async () => {
    token = await adminToken();
  });

  test.afterAll(async () => {
    if (slug) await api(`/programs/${slug}`, token, { method: "DELETE" });
  });

  test("agency creates a programme and assigns a partner in the admin portal", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${ADMIN_URL}/login`, { waitUntil: "domcontentloaded" });
    await hydrated(page);
    await page.fill("#email", ADMIN_EMAIL!);
    await page.fill("#password", ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: 30_000 });

    await page.goto(`${ADMIN_URL}/programs`, { waitUntil: "domcontentloaded" });
    await hydrated(page);
    await page.getByRole("button", { name: /create programme/i }).first().click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.locator("#name").fill(name);
    await dialog.locator("#description").fill("Created by the UI test to check partner assignment.");

    // target LGAs: select all
    await dialog.getByRole("button", { name: /^select all$/i }).click();

    // dates
    const start = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
    const end = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10);
    await dialog.locator("#startDate").fill(start);
    await dialog.locator("#endDate").fill(end);

    // outcome metric (the default progress mode tracks one)
    if (await dialog.locator("#primaryMetric").count()) {
      await dialog.locator("#primaryMetric").fill("Children vaccinated");
      await dialog.locator("#targetCount").fill("1000");
    }

    // the partner picker
    await dialog.locator("#partner-search").fill("Demo");
    await dialog.getByRole("group", { name: "Development partners" }).getByLabel(PARTNER).check();
    await expect(dialog.getByRole("list", { name: "Selected partners" })).toContainText(PARTNER);

    await dialog.getByRole("button", { name: /^create programme$/i }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });

    // saved with the partner
    const list = await api(`/programs?limit=100&q=${encodeURIComponent(name)}`, token);
    const created = list.body.data.data.find((p: { name: string }) => p.name === name);
    expect(created, "programme exists").toBeTruthy();
    slug = created.slug;
    expect(created.partners.map((p: { name: string }) => p.name)).toContain(PARTNER);

    // admin detail page lists the partner
    await page.goto(`${ADMIN_URL}/programs/${slug}`, { waitUntil: "domcontentloaded" });
    await hydrated(page);
    await expect(page.getByText("Development Partners")).toBeVisible();
    await expect(page.getByText(PARTNER).first()).toBeVisible();
    await ctx.close();
  });

  test("the partner sees it, updates progress, and cannot create or archive", async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      storageState: CONTRIBUTOR_STATE,
      baseURL: process.env.BASE_URL ?? "http://localhost:3004",
    });
    const page = await ctx.newPage();

    await page.goto("/my-programs", { waitUntil: "domcontentloaded" });
    await hydrated(page);
    // the list renders a table and a card layout; only one is visible at this width
    await expect(page.locator("a:visible", { hasText: name }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /create programme/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^archive$/i })).toHaveCount(0);

    // creating is not possible, even by URL
    await page.goto("/my-programs/new", { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/my-programs\/?$/, { timeout: 15_000 });

    // the progress page: no name, date or status fields, and saving works
    await page.goto(`/my-programs/${slug}/edit?progress=1`, { waitUntil: "domcontentloaded" });
    await hydrated(page);
    await expect(page.getByRole("heading", { name: /update progress/i })).toBeVisible();
    await expect(page.locator("#name")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^archive$/i })).toHaveCount(0);
    await expect(page.getByText(/^status$/i)).toHaveCount(0);

    await page.locator("#progress-reach").fill("321");
    await page.getByRole("button", { name: /save/i }).first().click();
    await expect
      .poll(async () => (await api(`/programs/${slug}`, token)).body.data.reach_count, { timeout: 15_000 })
      .toBe(321);

    // the public programme page shows the partner
    await page.goto(`/programs/${slug}`, { waitUntil: "domcontentloaded" });
    await hydrated(page);
    await expect(page.getByText(PARTNER).first()).toBeVisible();
    await ctx.close();
  });

  test("after the agency removes the partner, the programme disappears from its list", async ({ browser }) => {
    const removed = await api(`/programs/${slug}`, token, {
      method: "PATCH",
      body: JSON.stringify({ partnerIds: [] }),
    });
    expect(removed.status).toBe(200);

    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      storageState: CONTRIBUTOR_STATE,
      baseURL: process.env.BASE_URL ?? "http://localhost:3004",
    });
    const page = await ctx.newPage();
    await page.goto("/my-programs", { waitUntil: "domcontentloaded" });
    await hydrated(page);
    await expect(page.getByText(name)).toHaveCount(0);
    await ctx.close();
  });
});
