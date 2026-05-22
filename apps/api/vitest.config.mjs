import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.js', 'src/tests/**/*.test.js'],
    testTimeout: 15000,
    hookTimeout: 15000,
    setupFiles: ['src/tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.js'],
      exclude: ['src/seeds/**', 'src/index.js'],
    },
  },
});
