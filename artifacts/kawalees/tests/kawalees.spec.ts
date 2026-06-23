import { expect, test } from "@playwright/test";

const appRoute = (path: string) => (path === "/" ? "" : path.replace(/^\//, ""));

test.describe("Kawalees core public flow", () => {
  test("home page loads with Arabic RTL structure and primary CTA", async ({ page }) => {
    await page.goto(appRoute("/"));

    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("body")).toContainText("كواليس");
    await expect(page.getByTestId("link-join")).toBeVisible();
  });

  test("main navigation opens the join page", async ({ page }) => {
    await page.goto(appRoute("/"));

    await page.getByTestId("link-join").click();

    await expect(page).toHaveURL(/\/kawalees\/join$/);
    await expect(page.locator("form")).toBeVisible();
  });

  test("join form exposes labels and required-field cues", async ({ page }) => {
    await page.goto(appRoute("/join"));

    await expect(page.locator("form")).toBeVisible();
    await expect.poll(() => page.locator("label[for]").count()).toBeGreaterThan(8);
    await expect.poll(() => page.locator("label", { hasText: "*" }).count()).toBeGreaterThan(4);
  });

  test("projects page loads from navigation route", async ({ page }) => {
    await page.goto(appRoute("/projects"));

    await expect(page).toHaveURL(/\/kawalees\/projects$/);
    await expect(page.locator("main")).toContainText("الكاستنج");
  });

  test("mobile viewport has no obvious horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appRoute("/"));

    const hasOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > window.innerWidth + 1;
    });

    expect(hasOverflow).toBe(false);
  });
});
