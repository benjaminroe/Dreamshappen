import { test, expect } from "@playwright/test";

test("newsletter capture confirms subscription", async ({ page }) => {
  await page.goto("/");
  const email = `lead+${Date.now()}@example.com`;
  await page.getByTestId("newsletter-email").fill(email);
  await page.getByTestId("newsletter-submit").click();
  await expect(page.getByTestId("newsletter-success")).toContainText(/on the list/i);
});

test("newsletter rejects an invalid email", async ({ page, request }) => {
  const res = await request.post("/api/newsletter", {
    data: { email: "not-an-email" },
    failOnStatusCode: false,
  });
  expect(res.status()).toBe(400);
});
