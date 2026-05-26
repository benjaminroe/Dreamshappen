import { test, expect } from "@playwright/test";

const PDF_BYTES = Buffer.from("%PDF-1.4\n% e2e uploaded dossier\n%%EOF");

test("admin login is required and gates the dashboard", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);

  // Wrong credentials are rejected.
  await page.getByTestId("admin-email").fill("admin@dreamshappenltd.com");
  await page.getByTestId("admin-password").fill("wrong");
  await page.getByTestId("admin-login").click();
  await expect(page.getByTestId("login-error")).toBeVisible();
});

test("admin can create a discount code that applies at checkout", async ({ page, request }) => {
  await page.goto("/admin/login");
  await page.getByTestId("admin-email").fill("admin@dreamshappenltd.com");
  await page.getByTestId("admin-password").fill("changeme");
  await page.getByTestId("admin-login").click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.getByTestId("discount-code").fill("E2E25");
  await page.getByTestId("discount-percent").fill("25");
  await page.getByTestId("discount-save").click();
  await expect(page.getByTestId("discount-list")).toContainText("E2E25");

  // The code reduces the cart total via the pricing API.
  const res = await request.post("/api/cart/price", {
    data: { slugs: ["architecture-of-life"], code: "E2E25" },
  });
  const data = await res.json();
  expect(data.discountCode).toBe("E2E25");
  expect(data.discountAmount).toBeGreaterThan(0);
});

test("admin can publish a dossier with a PDF and it reaches the storefront", async ({ page }) => {
  // Sign in.
  await page.goto("/admin/login");
  await page.getByTestId("admin-email").fill("admin@dreamshappenltd.com");
  await page.getByTestId("admin-password").fill("changeme");
  await page.getByTestId("admin-login").click();
  await expect(page).toHaveURL(/\/admin$/);

  // Create a new dossier with an uploaded PDF.
  await page.getByTestId("new-product").click();
  await expect(page).toHaveURL(/\/admin\/products\/new/);
  await page.getByTestId("pf-title").fill("E2E Strategy Dossier");
  await page.getByTestId("pf-subtitle").fill("Created by the e2e suite.");
  await page.getByTestId("pf-price").fill("129.00");
  await page.getByTestId("pf-pdf").setInputFiles({
    name: "e2e.pdf",
    mimeType: "application/pdf",
    buffer: PDF_BYTES,
  });
  await page.getByTestId("pf-save").click();

  // Back on the dashboard, the dossier is listed.
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByTestId("admin-product-list")).toContainText("E2E Strategy Dossier");

  // It appears in the public storefront.
  await page.goto("/collections/e2e-strategy-dossier");
  await expect(page.getByRole("heading", { level: 1, name: "E2E Strategy Dossier" })).toBeVisible();
  await expect(page.getByText("AED 129.00")).toBeVisible();

  // And it can be purchased and downloaded — confirming CMS-controlled distribution.
  await page.getByTestId("add-to-cart").click();
  await page.goto("/cart");
  await page.getByTestId("checkout-email").fill("admin-buyer@example.com");
  await page.getByTestId("checkout-button").click();
  await page.getByTestId("simulate-pay").click();
  await expect(page).toHaveURL(/\/checkout\/success/);

  const href = await page.getByTestId("download-link").first().getAttribute("href");
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
  const body = await res.body();
  expect(body.subarray(0, 4).toString()).toBe("%PDF");
});
