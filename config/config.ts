import dotenv from "dotenv";
import path from "node:path";

// Load the selected environment file (for example: TEST_ENV=qa).
const environmentName = (process.env.TEST_ENV ?? "qa").toLowerCase();
dotenv.config({
  path: path.resolve(process.cwd(), "config", `.env.${environmentName}`)
});

export type SupportedBrowser = "chromium" | "firefox" | "webkit";

export interface FrameworkConfig {
  baseUrl: string;
  username: string;
  password: string;
  invalidUsername: string;
  invalidPassword: string;
  browserType: SupportedBrowser;
  headless: boolean;
  timeout: number;
}

const requestedBrowser = (process.env.BROWSER ?? "chromium").toLowerCase();
const browserType: SupportedBrowser =
  requestedBrowser === "firefox" || requestedBrowser === "webkit" ? requestedBrowser : "chromium";

export const config: FrameworkConfig = {
  baseUrl: process.env.BASE_URL ?? "https://www.saucedemo.com/",
  username: process.env.USERNAME ?? "standard_user",
  password: process.env.PASSWORD ?? "secret_sauce",
  invalidUsername: process.env.INVALID_USERNAME ?? "invalid_user",
  invalidPassword: process.env.INVALID_PASSWORD ?? "invalid_password",
  browserType,
  headless: (process.env.HEADLESS ?? "true").toLowerCase() !== "false",
  timeout: Number(process.env.TIMEOUT ?? 30000)
};
