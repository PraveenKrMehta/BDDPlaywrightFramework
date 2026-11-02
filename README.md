# Playwright + Cucumber BDD Framework

A beginner-friendly TypeScript automation framework for SauceDemo using Playwright as the browser automation library and Cucumber as the BDD test runner.

## Technology stack

- Node.js and npm
- TypeScript
- Playwright
- Cucumber
- ts-node
- dotenv
- Multiple Cucumber HTML Reporter

## Project architecture

```text
features/          Business-readable Gherkin scenarios
step-definitions/  Cucumber step implementations
pages/             Page Object Model locators and UI actions
hooks/             Browser setup, screenshots, and cleanup
config/            Environment loading and framework settings
test-runner/       Cucumber CLI/programmatic runner
utils/             Shared helper area
reports/           JSON and HTML execution reports
screenshots/       Full-page screenshots captured for failures
```

Execution files of note:

- `features/login.feature` — feature and scenarios.
- `step-definitions/login.steps.ts` — maps Gherkin text to methods.
- `pages/LoginPage.ts` — selector and interaction layer.
- `hooks/hooks.ts` — Browser, BrowserContext, and Page lifecycle.
- `config/config.ts` — selects browser, timeout, URL, and credentials.
- `test-runner/runner.ts` — executes Cucumber and generates HTML report output.

## Installation

Run from the project root:

```powershell
npm install
```

## Install Playwright browsers

```powershell
npx playwright install
```

For a restricted Chromium-only setup:

```powershell
npx playwright install chromium
```

## Environment configuration

Environment files live in the `config` directory. Select a file using `TEST_ENV`.

`config/.env.qa`:

```env
BASE_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce
BROWSER=chromium
HEADLESS=true
TIMEOUT=30000
```

`config/.env.uat` uses the same structure and can point to another environment.

PowerShell examples:

```powershell
$env:TEST_ENV="qa"
$env:TEST_ENV="uat"
```

Credentials are read from environment variables. The framework also supplies SauceDemo defaults for local convenience.

## Execute all BDD tests

```powershell
npm run test:bdd
```

## Execute a specific feature

```powershell
npx ts-node test-runner/runner.ts features/login.feature
```

Cucumber's direct CLI equivalent is:

```powershell
npx cucumber-js features/login.feature --require-module ts-node/register --require step-definitions/**/*.ts --require hooks/**/*.ts
```

## Execute by tag

```powershell
npm run test:smoke
npm run test:regression
```

You can also pass arbitrary tags to the runner:

```powershell
npx ts-node test-runner/runner.ts --tags "@smoke"
npx ts-node test-runner/runner.ts --tags "@regression and not @wip"
```

## Run in headed mode

```powershell
npm run test:bdd:headed
```

Or explicitly:

```powershell
$env:HEADLESS="false"
npm run test:bdd
```

## Generate the HTML report

```powershell
npm run test:bdd:html
```

The runner generates:

```text
reports/cucumber.json
reports/html/index.html
```

Open `reports/html/index.html` in a browser. The report includes feature, scenario, step, duration, pass/fail status, failure messages, environment metadata, and failure attachments.

## Screenshots on failure

The Cucumber `After` hook checks the scenario result. On failure, it:

1. Captures a full-page Playwright screenshot.
2. Saves it under `screenshots/`.
3. Attaches it to the Cucumber report.
4. Always closes the Page, BrowserContext, and Browser afterward.

The cleanup is placed in `finally`, so browser resources are closed even if screenshot capture or a step fails.

## Environment concept

- `TEST_ENV=qa` loads `config/.env.qa`.
- `TEST_ENV=uat` loads `config/.env.uat`.
- Environment variables can override values loaded from these files.

## Execution flow

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

1. Cucumber reads the `.feature` file.
2. `Given`, `When`, and `Then` steps map to TypeScript methods.
3. Each step calls a reusable Page Object method.
4. The Page Object performs locator actions through Playwright `Page`.
5. Playwright controls the browser against SauceDemo.
6. The Before and After hooks manage resources for each scenario.
7. Cucumber records durations, status, failures, and attachments in JSON and HTML reports.

## Browser lifecycle terminology

- **Browser** — an installed browser process such as Chromium.
- **BrowserContext** — an isolated browser session with its own cookies and storage.
- **Page** — a tab within a BrowserContext.

A Browser is launched before each scenario, then a fresh BrowserContext and Page are created. This isolation prevents session state, cookies, or login state from leaking between scenarios.
