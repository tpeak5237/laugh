import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: process.env.TEST_BASE_URL ?? 'http://127.0.0.1:4319', trace: 'retain-on-failure' },
  webServer: process.env.TEST_BASE_URL ? undefined : {
    command: 'npm run preview -- --port 4319 --strictPort',
    url: 'http://127.0.0.1:4319', reuseExistingServer: !process.env.CI,
  },
  projects: ['chromium', 'webkit'].flatMap(browserName => [
    { name: `${browserName}-mobile`, use: { browserName: browserName as 'chromium' | 'webkit', viewport: { width: 390, height: 844 } } },
    { name: `${browserName}-tablet`, use: { browserName: browserName as 'chromium' | 'webkit', viewport: { width: 768, height: 1024 } } },
    { name: `${browserName}-desktop`, use: { browserName: browserName as 'chromium' | 'webkit', viewport: { width: 1440, height: 1000 } } },
  ]),
});
