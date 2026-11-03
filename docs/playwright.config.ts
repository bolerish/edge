import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'src',
  fullyParallel: false,
  outputDir: '../.private/playwright',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4183',
    screenshot: 'on',
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      executablePath: process.env.WISP_CHROMIUM_EXECUTABLE || undefined,
    },
  },
  webServer: {
    command:
      'pnpm build && pnpm exec vite preview --host 127.0.0.1 --port 4183 --strictPort',
    url: 'http://127.0.0.1:4183',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
