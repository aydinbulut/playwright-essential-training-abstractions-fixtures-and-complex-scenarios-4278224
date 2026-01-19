import { test, expect } from "@playwright/test";
import { LoginPage } from "../../lib/pages/login.page";
import { registerUser } from "../../lib/datafactory/register";

test("login without page object", async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await page.locator('[data-test="nav-sign-in"]').click();
  await page
    .locator('[data-test="email"]')
    .fill("customer@practicesoftwaretesting.com");
  await page.locator('[data-test="password"]').fill("welcome01");
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="nav-menu"]')).toContainText(
    "Jane Doe"
  );
  await expect(page.locator('[data-test="page-title"]')).toContainText(
    "My account"
  );
});

test("login with page object", async ({ page }) => {
  const email = "customer@practicesoftwaretesting.com";
  const password = "welcome01";
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
  await expect(page.getByTestId("page-title")).toContainText("My account");
});

test("login with newly registered user", async ({ page }) => {
  // unique email for each test run
  const email = `aydin_bulut_${Date.now()}@epam.com`;
  const password = "123456Pst*";

  // create user via API so that we can test login functionality standalone
  const createdUserData = await registerUser(email, password);

  // login with newly created user
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);

  // assertions to verify successful login
  await expect(page.getByTestId("nav-menu")).toContainText(`${createdUserData.first_name} ${createdUserData.last_name}`);
  await expect(page.getByTestId("page-title")).toContainText("My account");
});