import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/join", "/projects"];
const appRoute = (path: string) => (path === "/" ? "" : path.replace(/^\//, ""));

test.describe("accessibility smoke checks", () => {
  for (const path of pages) {
    test(`has no critical axe violations on ${path}`, async ({ page }) => {
      await page.goto(appRoute(path));

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const criticalViolations = results.violations.filter(
        (violation) => violation.impact === "critical",
      );

      if (results.violations.length > 0) {
        test.info().annotations.push({
          type: "axe-summary",
          description: results.violations
            .map((violation) => `${violation.id}:${violation.impact ?? "unknown"}`)
            .join(", "),
        });
      }

      expect(criticalViolations).toEqual([]);
    });
  }
});
