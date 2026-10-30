import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3004";

/**
 * Mobile responsiveness audit. See e2e/README.md.
 *
 *   npm run e2e:responsive            # all pages x all viewports
 *   VIEWPORTS=375x667 npm run e2e:responsive
 *   ROUTES='/learning,/dataportal' npm run e2e:responsive
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.spec\.ts/,
  outputDir: "./e2e/results/artifacts",
  // Pages talk to a live API and can be slow on first compile in dev.
  timeout: 90_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: 0,
  reporter: [
    ["list"],
    ["./e2e/summary-reporter.ts", { outputDir: "e2e/results" }],
  ],
  use: {
    baseURL,
    browserName: "chromium",
    ignoreHTTPSErrors: true,
    // Local audits against a frontend origin the API's CORS list does not know about.
    launchOptions: process.env.PW_DISABLE_CORS ? { args: ["--disable-web-security"] } : {},
  },
  webServer: process.env.PW_NO_SERVER
    ? undefined
    : {
        // `start` needs `npm run build` first; `dev` works out of the box but
        // compiles each page on first hit (slower, still correct).
        command: process.env.PW_SERVER === "start" ? "npm run start" : "npm run dev",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
