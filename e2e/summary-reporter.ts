import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  Reporter,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

interface Row {
  viewport: string;
  route: string;
  status: TestResult["status"];
  findings: Array<{ severity: "fail" | "warn"; type: string; detail: string }>;
  skipped?: string;
  screenshot?: string;
}

/**
 * Writes e2e/results/report.md and report.json: one section per route listing
 * what is wrong at which screen size, worst pages first.
 */
export default class SummaryReporter implements Reporter {
  private rows: Row[] = [];
  private outputDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir ?? "e2e/results";
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // titlePath() ends with [..., <viewport describe>, <route test title>]
    const titles = test.titlePath().filter(Boolean);
    const row: Row = {
      viewport: titles[titles.length - 2] ?? "?",
      route: titles[titles.length - 1] ?? "?",
      status: result.status,
      findings: [],
    };
    for (const a of test.annotations) {
      const [severity, ...type] = a.type.split(":");
      if (a.type === "skipped") row.skipped = a.description;
      else if (a.type === "screenshot") row.screenshot = a.description;
      else if (severity === "fail" || severity === "warn") {
        row.findings.push({ severity, type: type.join(":"), detail: a.description ?? "" });
      }
    }
    if (result.status === "timedOut") {
      row.findings.push({ severity: "fail", type: "timeout", detail: "page did not finish loading in time" });
    }
    this.rows.push(row);
  }

  onEnd() {
    // Only the page audit produces a report (not the synthetic self-test).
    if (!this.rows.some((r) => /^\d+x\d+$/.test(r.viewport))) return;
    mkdirSync(this.outputDir, { recursive: true });
    writeFileSync(join(this.outputDir, "report.json"), JSON.stringify(this.rows, null, 2));

    const byRoute = new Map<string, Row[]>();
    for (const r of this.rows) byRoute.set(r.route, [...(byRoute.get(r.route) ?? []), r]);

    const score = (rows: Row[]) =>
      rows.reduce(
        (n, r) => n + r.findings.filter((f) => f.severity === "fail").length * 10 + r.findings.length,
        0,
      );

    const failing = [...byRoute.entries()].filter(([, rows]) =>
      rows.some((r) => r.findings.some((f) => f.severity === "fail")),
    );
    const warnOnly = [...byRoute.entries()].filter(
      ([k, rows]) => !failing.some(([f]) => f === k) && rows.some((r) => r.findings.length > 0),
    );
    const clean = [...byRoute.entries()].filter(
      ([, rows]) => rows.every((r) => r.findings.length === 0 && !r.skipped),
    );
    const skipped = [...byRoute.entries()].filter(([, rows]) => rows.every((r) => r.skipped));

    const lines: string[] = [
      "# Mobile responsiveness report",
      "",
      `Generated ${new Date().toISOString()}`,
      "",
      `- Pages checked: ${byRoute.size - skipped.length} of ${byRoute.size}`,
      `- With layout failures: ${failing.length}`,
      `- With warnings only: ${warnOnly.length}`,
      `- Clean: ${clean.length}`,
      `- Skipped: ${skipped.length}`,
      "",
    ];

    const section = (title: string, entries: Array<[string, Row[]]>) => {
      if (entries.length === 0) return;
      lines.push(`## ${title}`, "");
      for (const [route, rows] of entries.sort((a, b) => score(b[1]) - score(a[1]))) {
        lines.push(`### \`${route}\``, "");
        for (const r of rows.sort((a, b) => a.viewport.localeCompare(b.viewport))) {
          if (r.findings.length === 0) continue;
          lines.push(`**${r.viewport}**`);
          for (const f of r.findings) {
            lines.push(`- ${f.severity === "fail" ? "FAIL" : "warn"} \`${f.type}\`: ${f.detail}`);
          }
          if (r.screenshot) lines.push(`- screenshot: \`${r.screenshot}\``);
          lines.push("");
        }
      }
    };

    section("Layout failures", failing);
    section("Warnings only", warnOnly);

    if (clean.length) {
      lines.push("## Clean", "", ...clean.map(([r]) => `- \`${r}\``), "");
    }
    if (skipped.length) {
      lines.push(
        "## Skipped",
        "",
        ...skipped.map(([r, rows]) => `- \`${r}\`: ${rows[0].skipped}`),
        "",
      );
    }

    writeFileSync(join(this.outputDir, "report.md"), lines.join("\n"));
    console.log(`\nResponsive report: ${join(this.outputDir, "report.md")}`);
  }
}
