# Mobile responsiveness audit

Loads every page in `src/app` (found automatically) at several screen sizes and reports layout problems.

## Run it

```bash
# one-time (already done on this machine)
npm i -D @playwright/test && npx playwright install chromium

# fastest and most accurate: production build
npm run build
PW_SERVER=start npm run e2e:responsive

# or let Playwright start `next dev` (works, but each page compiles on first visit, so it is slow)
npm run e2e:responsive
```

The API should be running (default `http://localhost:3001/api/v1`, override with `API_URL`). It supplies sample slugs for pages like `/dataportal/[slug]` and real data to lay out. Without it those pages are skipped or render empty states.

If the app is already running elsewhere: `PW_NO_SERVER=1 BASE_URL=https://staging.example.org npm run e2e:responsive`.

### Signed-in pages

The `(dashboard)` pages need a session. Two ways:

- **Demo accounts (recommended, no manual steps):** in `nsgdp-backend` run `npm run seed:demo` once, then here `npm run e2e:login:demo`. It signs in the demo contributor, partner admin and viewer and saves `e2e/.auth/*.json`. The contributor session is the default.
- **Your own account:** `npm run e2e:login`, sign in in the browser window (MFA works).

Sessions are git-ignored. Without one, signed-in pages are reported as skipped. If the frontend runs on an origin the API's CORS list does not allow, add `PW_DISABLE_CORS=1` (test browser only).

### Other specs

- `e2e/interactions.spec.ts`: opens the public menu, the dashboard drawer, a dialog and the user menu at phone sizes (including landscape) and checks they fit and close. Needs the demo sessions.
- `e2e/selftest.spec.ts`: proves the audit really detects sideways scroll, clipped content, small targets and a missing viewport tag, so a clean report can be trusted. Pages that need your own data (for example `/my-programs/[slug]`) get a sample from the API, or set it yourself:

```bash
E2E_PARAMS='{"/my-programs/[slug]":"my-programme-slug"}' npm run e2e:responsive
```

### Options (environment variables)

| Variable | Default | Meaning |
|---|---|---|
| `VIEWPORTS` | `320x640,375x667,412x915,768x1024` | Sizes to test |
| `ROUTES` | all | Comma list, e.g. `/learning,/dataportal` (matches sub-pages too) |
| `MIN_TAP` | `40` | Minimum tap target on phones (< 768px), px. WCAG 2.2 AA asks 24, Apple 44, Material 48 |
| `STRICT` | `1` | `0` reports failures without failing the run |
| `SCREENSHOTS` | `1` | `0` skips full-page screenshots |

## What it checks

Fails the test:
- **horizontal-scroll**: the page is wider than the screen.
- **clipped-content**: elements extend past the screen edge and are hidden by `overflow` (outside a scrollable box such as a table wrapper).
- **page-error**: an uncaught JavaScript error.
- **http-error**: the page returned 5xx.
- **viewport-meta**: no `<meta name="viewport">`.
- **auth-redirect**: a signed-in page bounced to `/login` (session expired).

Reported as warnings only:
- **small-tap-target**: buttons and links under `MIN_TAP` px on phone widths (inline links in text are exempt; map markers are ignored).
- **input-zoom**: text fields under 16px on phones, which make iPhone Safari zoom the page on focus.
- **small-text**: text under 12px.
- **api-5xx**, **console-error**, **not-found**.

## Output

- `e2e/results/report.md`: per page and per screen size, worst first.
- `e2e/results/report.json`: same data for tooling.
- `e2e/results/screens/<size>/<page>.png`: full-page screenshots.

## Limits

- It tests layout in Chromium with a phone viewport and touch enabled. It does not emulate iOS Safari quirks (100vh, notch, input zoom).
- Overflow and tap-target checks look at what rendered when the page settled. Menus, dialogs and tabs that open on interaction are not opened.
- Warnings are a to-do list, not defects by themselves; many small icon buttons are intentional.
