import { defineConfig } from "@playwright/test";
import { config } from "./config/config";

/** Shared Playwright defaults used by the framework and browser launch code. */
export default defineConfig({
  timeout: config.timeout,
  use: {
    baseURL: config.baseUrl,
    headless: config.headless,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure"
  }
});
