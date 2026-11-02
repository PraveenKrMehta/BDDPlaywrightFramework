import { Given, When, Then, World } from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import { config } from "../config/config";
import { LoginPage } from "../pages/LoginPage";

// This type makes Playwright Page access in each step explicit and type-safe.
interface PlaywrightWorld extends World {
  page: Page;
}

Given("I navigate to the login page", async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigateToLoginPage(config.baseUrl);
});

When("I enter valid username and password", async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.enterUsername(config.username);
  await loginPage.enterPassword(config.password);
});

When("I enter invalid username and password", async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.enterUsername(config.invalidUsername);
  await loginPage.enterPassword(config.invalidPassword);
});

When("I click the login button", async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickLogin();
});

Then("I should be successfully logged in", async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifySuccessfulLogin();
});

Then("I should see an invalid login error", async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifyInvalidLoginError();
});
