import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 15_000,
    environment: 'node',
  },
});
