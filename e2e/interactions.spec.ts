import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * States the page audit cannot see because they only exist after a tap:
 * navigation drawers, menus and dialogs. Each must fit the screen, never
 * make the page scroll sideways, and be dismissible.
 *
 * Needs the demo sessions: npm run e2e:login:demo
 */
const AUTH = (name: string) => join(__dirname, ".auth", `${name}.json`);
const have = (name: string) => existsSync(AUTH(name));

const SIZES = [
  { name: "320x640", width: 320, height: 640 },
  { name: "375x667", width: 375, height: 667 },
  { name: "412x915", width: 412, height: 915 },
  { name: "667x375 landscape", width: 667, height: 375 },
];

async function settle(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
  await page.waitForTimeout(600);
}

async function expectFits(page: Page, el: Locator, what: string) {
  const box = await el.boundingBox();
  expect(box, `${what} is not visible`).not.toBeNull();
  const vp = page.viewportSize()!;
  expect(box!.x, `${what} starts left of the screen`).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width, `${what} runs off the right edge`).toBeLessThanOrEqual(vp.width + 1);
  expect(box!.y, `${what} starts above the screen`).toBeGreaterThanOrEqual(-1);
  expect(box!.y + box!.height, `${what} runs off the bottom (not scrollable?)`).toBeLessThanOrEqual(vp.height + 1);
}

async function expectNoSidewaysScroll(page: Page) {
  const { sw, vw } = await page.evaluate(() => ({
    sw: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    vw: document.documentElement.clientWidth,
  }));
  expect(sw, "page scrolls sideways").toBeLessThanOrEqual(vw + 1);
}

for (const size of SIZES) {
  test.describe(size.name, () => {
    test.use({
      viewport: { width: size.width, height: size.height },
      isMobile: size.width < 600,
      hasTouch: true,
    });

    test("public site menu opens, fits, and closes", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await settle(page);
      await page.getByRole("button", { name: "Open menu" }).click();
      const menu = page.getByRole("navigation", { name: "Mobile navigation" });
      await expect(menu).toBeVisible();
      await expectFits(page, menu, "mobile menu");
      await expectNoSidewaysScroll(page);
      await page.getByRole("button", { name: "Close menu" }).first().click();
      await expect(menu).toBeHidden();
    });

    test("signed-in dashboard menu opens, fits, and closes", async ({ browser }) => {
      test.skip(!have("contributor"), "run `npm run e2e:login:demo` first");
      const ctx = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        isMobile: size.width < 600,
        hasTouch: true,
        storageState: AUTH("contributor"),
      });
      const page = await ctx.newPage();
      await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
      await settle(page);
      // The dashboard's own toggle is labelled "<organisation>Menu"; "Open menu" is the public site's.
      await page.getByRole("button", { name: /Menu$/ }).first().click();
      const drawer = page.getByRole("dialog", { name: "Navigation menu" });
      await expect(drawer).toBeVisible();
      await expectNoSidewaysScroll(page);
      const links = drawer.getByRole("link");
      expect(await links.count()).toBeGreaterThan(3);
      await page.getByRole("button", { name: "Close menu" }).last().click();
      await expect(drawer).toBeHidden();
      await ctx.close();
    });

    test("request-access dialog fits the screen and its field does not zoom iOS", async ({ browser }) => {
      test.skip(!have("viewer"), "run `npm run e2e:login:demo` first");
      const ctx = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        isMobile: size.width < 600,
        hasTouch: true,
        storageState: AUTH("viewer"),
      });
      const page = await ctx.newPage();
      await page.goto("/dataportal/demo-restricted-dataset-open", { waitUntil: "domcontentloaded" });
      await settle(page);
      await page.getByRole("button", { name: /request access/i }).first().click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expectFits(page, dialog, "request-access dialog");
      await expectNoSidewaysScroll(page);
      const fontPx = await dialog
        .locator("textarea")
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(fontPx, "textarea under 16px: iPhone zooms in on focus").toBeGreaterThanOrEqual(16);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await ctx.close();
    });

    test("user menu opens and fits", async ({ browser }) => {
      test.skip(!have("contributor"), "run `npm run e2e:login:demo` first");
      test.skip(size.width < 640, "the user menu only exists from the sm breakpoint; phones use the drawer");
      const ctx = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        isMobile: size.width < 600,
        hasTouch: true,
        storageState: AUTH("contributor"),
      });
      const page = await ctx.newPage();
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await settle(page);
      await page.getByRole("button", { name: "User menu" }).click();
      const menu = page.getByRole("menu");
      await expect(menu).toBeVisible();
      await expectFits(page, menu, "user menu");
      await expectNoSidewaysScroll(page);
      await ctx.close();
    });
  });
}
