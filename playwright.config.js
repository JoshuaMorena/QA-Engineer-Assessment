import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/, 
    },
    {
      name: 'chromium',
      dependencies: ['setup'], 
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'test-data/auth.json',
      },
    }
  ],
});
