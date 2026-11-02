import { expect, Page, Locator } from "@playwright/test";

/** Page Object: keeps SauceDemo selectors and interactions out of step definitions. */
export class LoginPage {
  private readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly inventoryContainer: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async navigateToLoginPage(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await expect(this.inventoryContainer).toBeVisible({ timeout: 15000 });
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async verifyInvalidLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 15000 });
    await expect(this.errorMessage).toContainText("Username and password do not match");
  }
}
