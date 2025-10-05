import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Setting global configurations (Setup and Teardown) */
  globalSetup: require.resolve('./config/global-setup'),
  globalTeardown: require.resolve('./config/api-global-teardown'),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-tests',
      testMatch: 'tests/api/**/*.spec.ts',
      use: {
        baseURL: process.env.API_URL,
      },
    },

    {
      name: 'login-tests',
      testMatch: 'tests/ui/login.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined,
      },
    },

    {
      name: 'ui-tests',
      testIgnore: 'tests/ui/login.spec.ts',
      testMatch: 'tests/ui/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth-state.json',
        baseURL: process.env.BASE_URL_UI
      },
    },
  ],
});
