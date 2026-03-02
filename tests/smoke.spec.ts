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

test("projects filtering shows empty state for unlikely query", async ({ page }) => {
  await page.goto("/");
  const input = page.getByPlaceholder("Filter projects...");
  await input.fill("this-query-should-not-match-anything-12345");
  await expect(page.getByText("No projects found.")).toBeVisible();
});

test("contact form shows validation error on incomplete submit", async ({ page }) => {
  await page.goto("/");
  const nameInput = page.getByLabel("Name");
  const emailInput = page.getByLabel("Email");
  const messageInput = page.getByLabel("Message");

  await nameInput.fill("Test User");
  await emailInput.fill("invalid-email");
  await messageInput.fill("Hello from Playwright test");

  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Please fill all fields correctly.")).toBeVisible();
});

test("github og api responds for known repo", async ({ request }) => {
  const res = await request.get("/api/github-og?owner=Pragadees15&repo=personal-portfolio");
  expect(res.status()).toBeLessThan(500);
});

test("revalidate api rejects missing secret", async ({ request }) => {
  const res = await request.post("/api/revalidate", {
    headers: { "content-type": "application/json" },
    data: { tag: "projects" },
  });
  expect(res.status()).toBe(401);
});

