import { expect, test } from "@playwright/test";
import { audit } from "./audit";

/**
 * Proves the audit actually detects what it claims to, so "0 failures" on the
 * real pages can be trusted. Runs against synthetic HTML, no server needed.
 */
const page = (body: string) =>
  `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">${body}</body></html>`;

test.use({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true });

test("detects a page that scrolls sideways", async ({ page: p }) => {
  await p.setContent(page(`<div id="wide" style="width:600px;height:20px;background:#ccc">wide</div>`));
  const a = await audit(p, 44);
  expect(a.scrollWidth).toBeGreaterThan(a.vw + 1);
  expect(a.overflowCount).toBeGreaterThan(0);
});

test("detects clipped content hidden by overflow", async ({ page: p }) => {
  await p.setContent(
    page(`<div style="overflow-x:hidden;width:100%"><div style="width:700px;height:20px;background:#ccc">clipped</div></div>`),
  );
  const a = await audit(p, 44);
  expect(a.scrollWidth).toBeLessThanOrEqual(a.vw + 1);
  expect(a.overflowCount).toBeGreaterThan(0);
});

test("allows content inside a horizontally scrollable table wrapper", async ({ page: p }) => {
  await p.setContent(
    page(`<div style="overflow-x:auto;width:100%"><table style="width:700px"><tr><td>a</td><td>b</td></tr></table></div>`),
  );
  const a = await audit(p, 44);
  expect(a.scrollWidth).toBeLessThanOrEqual(a.vw + 1);
  expect(a.overflowCount).toBe(0);
});

test("flags small tap targets and small text, ignores inline links", async ({ page: p }) => {
  await p.setContent(
    page(`<button style="width:20px;height:20px">x</button><p style="font-size:10px">tiny text</p><p>see <a href="#">this link</a> here</p>`),
  );
  const a = await audit(p, 44);
  expect(a.tinyCount).toBe(1);
  expect(a.smallTextCount).toBeGreaterThan(0);
});

test("flags a missing viewport meta tag", async ({ page: p }) => {
  await p.setContent(`<!doctype html><html><body>hi</body></html>`);
  expect((await audit(p, 44)).hasViewportMeta).toBe(false);
});
