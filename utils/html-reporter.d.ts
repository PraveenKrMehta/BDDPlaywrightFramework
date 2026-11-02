declare module "multiple-cucumber-html-reporter" {
  export interface ReportOptions {
    jsonDir: string;
    reportPath: string;
    reportName?: string;
    pageTitle?: string;
    displayDuration?: boolean;
    displayReportTime?: boolean;
    metadata?: Record<string, string | number | boolean | undefined>;
  }

  export function generate(options: ReportOptions): void;
  const reporter: { generate(options: ReportOptions): void };
  export default reporter;
}
