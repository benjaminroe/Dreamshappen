import { test, expect } from "@playwright/test";

test("full purchase flow: cart, discount, simulated payment, gated download", async ({ page }) => {
  // Add a dossier to the cart from its product page.
  await page.goto("/collections/architecture-of-life");
  await page.getByTestId("add-to-cart").click();
  await expect(page.getByTestId("add-to-cart")).toHaveAttribute("data-in-cart", "true");

  // Header cart count reflects the addition.
  await expect(page.getByTestId("cart-count")).toHaveText("1");

  // Go to the cart.
  await page.goto("/cart");
  await expect(page.getByTestId("cart-line")).toHaveCount(1);
  const total = page.getByTestId("cart-total");
  await expect(total).toContainText("AED");

  // Apply the launch discount and confirm the total drops.
  const before = (await total.textContent()) ?? "";
  await page.getByTestId("discount-input").fill("WELCOME10");
  await page.getByTestId("apply-discount").click();
  await expect(page.getByTestId("discount-msg")).toContainText(/applied/i);
  await expect(total).not.toHaveText(before);

  // Provide email and proceed to (simulated) payment.
  await page.getByTestId("checkout-email").fill("buyer@example.com");
  await page.getByTestId("checkout-button").click();

  // Simulated Stripe step.
  await expect(page).toHaveURL(/\/checkout\/confirm/);
  await page.getByTestId("simulate-pay").click();

  // Success page with a download link.
  await expect(page).toHaveURL(/\/checkout\/success/);
  await expect(page.getByRole("heading", { name: /Your dossiers are ready/i })).toBeVisible();
  const downloadLink = page.getByTestId("download-link").first();
  await expect(downloadLink).toBeVisible();

  // The gated download serves a real PDF.
  const href = await downloadLink.getAttribute("href");
  expect(href).toBeTruthy();
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
  const body = await res.body();
  expect(body.subarray(0, 4).toString()).toBe("%PDF");
});

test("download route rejects an invalid token", async ({ page }) => {
  const res = await page.request.get("/api/download/not-a-real-token", { failOnStatusCode: false });
  expect(res.status()).toBe(404);
});
