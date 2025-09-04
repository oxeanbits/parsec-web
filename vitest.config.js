/**
 * Vitest Configuration for Parsec Equations Library
 *
 * This configuration sets up Vitest for testing the equations-parser WebAssembly
 * integration with comprehensive test coverage and modern testing practices.
 */

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Test file patterns
    include: ['tests/**/*.{test,spec}.{js,mjs,ts}', 'tests/**/*.bench.{js,mjs,ts}'],
    exclude: [
      'tests/test-runner.html',
      'tests/simple-test.html',
      'tests/debug-test.html',
      'tests/*.html',
      'node_modules/**',
      'dist/**',
    ],

    // Test environment
    environment: 'jsdom', // Use jsdom for DOM APIs if needed

    // Global setup
    globals: true,

    // Test execution settings
    testTimeout: 10000, // 10 seconds timeout for WASM loading
    hookTimeout: 10000, // 10 seconds for setup/teardown

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['js/**/*.js', 'index.js', 'index.mjs'],
      exclude: ['tests/**', 'wasm/**', 'html/**', 'cpp/**', 'node_modules/**', 'coverage/**'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Browser-like environment configuration
    // This helps with WebAssembly module loading
    server: {
      deps: {
        // Inline dependencies that might have issues
        inline: [/equations_parser_wrapper/],
      },
    },

    // Mock WebAssembly environment if needed
    setupFiles: ['./tests/setup.js'],

    // Reporting
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './test-results.json',
    },

    // Test running behavior
    watch: false, // Set to true for watch mode by default
    run: true,

    // Pool options for parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1,
      },
    },

    // File system watching (for watch mode)
    watchExclude: ['node_modules/**', 'dist/**', 'coverage/**', 'wasm/**/*.wasm', '*.log'],
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './js'),
      '@tests': path.resolve(__dirname, './tests'),
      '@wasm': path.resolve(__dirname, './wasm'),
    },
  },

  // Define global constants
  define: {
    __TEST_ENV__: true,
    __VERSION__: JSON.stringify('1.0.0'),
  },

  // Server options for serving static files during testing
  server: {
    fs: {
      allow: ['.'],
    },
  },
})
