#!/usr/bin/env node
/**
 * Opens a real browser so you can sign in (including any MFA step), then saves
 * the session to e2e/.auth/user.json for the signed-in pages in the audit.
 *
 *   npm run e2e:login
 *
 * Use a contributor or partner-admin account: the dashboard pages are the
 * portal's signed-in area. The saved file contains tokens: it is git-ignored.
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3004";
const out = join(dirname(fileURLToPath(import.meta.url)), ".auth", "user.json");
mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: { width: 1100, height: 800 } });
const page = await context.newPage();
await page.goto(`${baseURL}/login`);

console.log("Sign in in the browser window. Waiting until you reach the dashboard (5 min limit)...");
await page.waitForURL(/\/(dashboard|datasets|development-partner)(\/|$|\?)/, { timeout: 5 * 60_000 });
await page.waitForTimeout(1500); // let the app write its tokens

await context.storageState({ path: out });
await browser.close();
console.log(`Saved session to ${out}`);
