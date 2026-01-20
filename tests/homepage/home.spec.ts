import { test, expect } from "@playwright/test";
import { harFilePath } from "@helpers/harFilePath";

test.describe("Home page with no auth", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test", async ({ page, headless }) => {
    await page.waitForLoadState("networkidle");
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("home-page-no-auth.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });

  test("check sign in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
  });

  test("validate page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  test("grid loads with 9 items", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(9);
    expect(await productGrid.getByRole("link").count()).toBe(9);
  });

  test("search for Thor Hammer", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
  });
});

test.describe("Home page customer 01 auth", () => {
  test.use({ storageState: ".auth/customer01.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test authorized", async ({ page, headless }) => {
    await page.waitForLoadState("networkidle");
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("home-page-customer01.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });
  test("check customer 01 is signed in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();
    await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
  });

  test("validate product data is visible in UI from API", async ({ page }) => {
    let products: any;
    await test.step("intercept /products", async () => {
      await page.route(
        "https://api.practicesoftwaretesting.com/products**",
        async (route) => {
          const response = await route.fetch();
          products = await response.json();
          route.continue();
        }
      );
    });

    await page.goto("/");

    await expect(page.locator(".skeleton").first()).not.toBeVisible();
    const productGrid = page.locator(".col-md-9");

    for (const product of products.data) {
      await expect(productGrid).toContainText(product.name);
      await expect(productGrid).toContainText(product.price.toString());
    }
  });

  // test example to show how to modify API response
  test("validate product data is visible from modified API", async ({ page }) => {
    await test.step("override /products", async () => {

      // register a route to intercept network request once it will happen
      await page.route(
        "https://api.practicesoftwaretesting.com/products**",
        async (route) => {
          const response = await route.fetch();
          const json = await response.json();

          // modify the response data
          json.data[0].name = "Mokced Product";
          json.data[0].price = 100000.01;
          json.data[0].in_stock = false;

          // fulfill the route with the modified data, without these the changes won't be applied
          await route.fulfill({ response, json });
        }
      );
    });

    await page.goto("/");

    // wait for loading skeleton to disappear before assertions, this ensures products are loaded
    await expect(page.locator(".skeleton").first()).not.toBeVisible();

    const productGrid = page.locator(".col-md-9");
    const firstProduct = productGrid.getByRole("link").first();

    await expect(firstProduct).toContainText("Mokced Product");
    await expect(firstProduct).toContainText("Out of stock");
  });

  test("validate product data is loaded from har file", async ({ page }) => {
    // register a route to intercept network request once it will happen, but this time from HAR file
    await test.step("Mock /products", async () => {
      await page.routeFromHAR(harFilePath('product'), {
        url: 'https://api.practicesoftwaretesting.com/products**',
        update: false
      });
    });

    await page.goto("/");

    // wait for loading skeleton to disappear before assertions, this ensures products are loaded
    await expect(page.locator(".skeleton").first()).not.toBeVisible();

    const productGrid = page.locator(".col-md-9");

    await expect(productGrid).toContainText("Happy Path Pliers");
    await expect(productGrid).toContainText("1.99");
  });
});
