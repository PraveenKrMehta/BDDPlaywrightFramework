import fs from "node:fs";
import path from "node:path";
import { After, Before, ITestCaseHookParameter, IWorldOptions, World, setDefaultTimeout, setWorldConstructor } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from "@playwright/test";
import { config, SupportedBrowser } from "../config/config";

setDefaultTimeout(config.timeout);

class BddWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(BddWorld);

function getBrowser(browserType: SupportedBrowser): typeof chromium | typeof firefox | typeof webkit {
  if (browserType === "firefox") return firefox;
  if (browserType === "webkit") return webkit;
  return chromium;
}

Before(async function (this: BddWorld) {
  const browserType = getBrowser(config.browserType);
  this.browser = await browserType.launch({ headless: config.headless });
  this.context = await this.browser.newContext({ viewport: { width: 1280, height: 720 } });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.timeout);
});

After(async function (this: BddWorld, scenario: ITestCaseHookParameter) {
  try {
    if (scenario.result?.status === "FAILED" && this.page) {
      fs.mkdirSync(path.resolve("screenshots"), { recursive: true });
      const safeName = scenario.pickle.name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
      const screenshotPath = path.resolve("screenshots", `${safeName}.png`);
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      this.attach(fs.readFileSync(screenshotPath), "image/png");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    this.attach(`Screenshot capture failed: ${message}`, "text/plain");
  } finally {
    await this.page?.close().catch(() => undefined);
    await this.context?.close().catch(() => undefined);
    await this.browser?.close().catch(() => undefined);
  }
});


