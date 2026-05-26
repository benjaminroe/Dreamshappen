import { test, expect } from "@playwright/test";

test.describe("Storefront", () => {
  test("home page presents the brand and links to collections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Dreams Happen/);
    await expect(
      page.getByRole("heading", { name: /Strategic frameworks for the global citizen/i })
    ).toBeVisible();

    await page.getByRole("link", { name: /Enter the Collections/i }).click();
    await expect(page).toHaveURL(/\/collections/);
    const cards = page.getByTestId("product-card");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(5);
  });

  test("product detail page shows price and metadata", async ({ page }) => {
    await page.goto("/collections/the-jurisdiction-atlas");
    await expect(page).toHaveTitle(/The Jurisdiction Atlas/);
    await expect(page.getByRole("heading", { level: 1, name: "The Jurisdiction Atlas" })).toBeVisible();
    await expect(page.getByText(/AED/).first()).toBeVisible();
    await expect(page.getByTestId("add-to-cart")).toBeVisible();
  });

  test("legal pages render", async ({ page }) => {
    for (const path of ["/legal/terms", "/legal/privacy", "/legal/refund"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
});
