import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import reporter from "multiple-cucumber-html-reporter";

// This runner keeps Cucumber as the test runner while Playwright remains the browser library.
const projectRoot = path.resolve(__dirname, "..");
const reportsDirectory = path.join(projectRoot, "reports");
fs.mkdirSync(reportsDirectory, { recursive: true });

const jsonReport = path.join(reportsDirectory, "cucumber.json");
const cucumberArguments = [
  "features/**/*.feature",
  "--require-module", "ts-node/register",
  "--require", "step-definitions/**/*.ts",
  "--require", "hooks/**/*.ts",
  "--format", "progress",
  "--format", `json:${jsonReport}`,
  ...process.argv.slice(2)
];

const cucumberExecutable = path.join(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "cucumber-js.cmd" : "cucumber-js"
);

const execution = spawnSync(cucumberExecutable, cucumberArguments, {
  cwd: projectRoot,
  stdio: "inherit",
  shell: process.platform === "win32"
});

if (fs.existsSync(jsonReport)) {
  reporter.generate({
    jsonDir: reportsDirectory,
    reportPath: path.join(reportsDirectory, "html"),
    reportName: "BDD Playwright Execution Report",
    pageTitle: "SauceDemo BDD Report",
    displayDuration: true,
    displayReportTime: true,
    metadata: {
      browser: process.env.BROWSER ?? "chromium",
      environment: process.env.TEST_ENV ?? "qa"
    }
  });
  console.log(`\nHTML report: ${path.join(reportsDirectory, "html", "index.html")}`);
}

process.exit(execution.status ?? 1);
