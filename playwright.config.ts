import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4000';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['github']] : [['html'], ['list']],
  outputDir: './test-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'fr-FR',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: process.env.CI
    ? {
        command: 'pnpm build && pnpm start',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
      }
    : {
        command: 'pnpm dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
