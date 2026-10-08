import { defineConfig, devices } from '@playwright/test';
import { config } from './src/utils/config-loader';

export default defineConfig({
  testDir: './tests',
  timeout: config.timeout,
  reporter: 'html',
  use: {
    baseURL: config.baseUrl,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
