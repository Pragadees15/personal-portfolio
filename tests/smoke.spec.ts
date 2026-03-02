import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Pragadeeswaran/i);
  await expect(page.locator("main")).toBeVisible();
});

test("resume page loads", async ({ page }) => {
  await page.goto("/resume");
  await expect(page).toHaveTitle(/Resume/i);
});

