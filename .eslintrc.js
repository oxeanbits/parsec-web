/**
 * ESLint Configuration for Parsec Equations Library
 *
 * Provides comprehensive linting rules for JavaScript/ES6+ code
 * with Prettier integration for formatting and specific considerations
 * for WebAssembly integration and cross-platform library development.
 */

module.exports = {
  // Environment configuration
  env: {
    browser: true,
    node: true,
    es2022: true,
    worker: true,
  },

  // Parser configuration for modern JavaScript
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },

  // Base configurations
  extends: ['eslint:recommended', 'prettier'],

  // Plugin configuration
  plugins: ['prettier'],

  // Global variables
  globals: {
    // Vitest globals
    describe: 'readonly',
    it: 'readonly',
    test: 'readonly',
    expect: 'readonly',
    beforeAll: 'readonly',
    beforeEach: 'readonly',
    afterAll: 'readonly',
    afterEach: 'readonly',
    vi: 'readonly',

    // WebAssembly globals
    WebAssembly: 'readonly',

    // AMD module globals
    define: 'readonly',

    // Test environment globals
    __TEST_ENV__: 'readonly',
    __VERSION__: 'readonly',
  },

  // Custom rules
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',

    // Variables
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'no-var': 'error',
    'prefer-const': 'error',

    // Functions
    'no-unused-expressions': 'error',
    'prefer-arrow-callback': 'error',

    // Best practices
    eqeqeq: ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-console': 'off', // Allow console for WebAssembly debugging
    'no-debugger': 'error',
    'no-alert': 'error',

    // ES6+ features
    'prefer-template': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true,
      },
    ],

    // Error handling
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',

    // Code complexity
    complexity: ['warn', 15],
    'max-depth': ['warn', 4],

    // Async/await
    'require-await': 'error',
    'no-return-await': 'error',

    // Classes
    'class-methods-use-this': 'off', // Allow methods that don't use 'this'
    'no-useless-constructor': 'error',

    // Imports/exports
    'no-duplicate-imports': 'error',

    // WebAssembly specific
    'no-new-wrappers': 'error',
    'no-prototype-builtins': 'error',
  },

  // Override rules for specific file patterns
  overrides: [
    // Test files
    {
      files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-magic-numbers': 'off', // Allow magic numbers in tests
        'prefer-arrow-callback': 'off', // Allow function expressions in tests
      },
    },

    // Configuration files
    {
      files: ['*.config.js', '.eslintrc.js', 'vitest.config.js'],
      rules: {
        'no-console': 'off',
      },
    },

    // WebAssembly wrapper files
    {
      files: ['js/**/*.js'],
      rules: {
        'no-console': 'off', // Allow console for WASM debugging
        complexity: ['warn', 20], // Allow higher complexity for WASM integration
      },
    },

    // Entry point files
    {
      files: ['index.js', 'index.mjs'],
      rules: {
        complexity: ['warn', 20], // Allow higher complexity for compatibility layers
      },
    },
  ],

  // Ignore patterns
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    'wasm/*.js', // Generated Emscripten files
    '*.wasm',
    'html/',
    'docs/',
    '*.min.js',
  ],
}
