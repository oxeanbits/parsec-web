/**
 * Vitest Test Setup
 *
 * Global setup configuration for testing the Parsec Equations Library.
 * This file handles WebAssembly module initialization and test environment preparation.
 */

import { beforeAll, beforeEach, afterAll, afterEach } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Global test configuration
global.WASM_PATH = path.resolve(__dirname, '../wasm/equations_parser.js')
global.TEST_TIMEOUT = 10000

// Global evaluator instance for tests
global.evaluator = null

// Mock console methods if needed for cleaner test output
const originalConsoleLog = console.log
const originalConsoleError = console.error

// Setup before all tests
beforeAll(async () => {
  console.log('🔧 Setting up Vitest test environment...')

  // Set up any global test configuration
  global.testStartTime = Date.now()

  // Initialize the evaluator once for all tests
  try {
    // Dynamic import of the Parsec
    const { default: Parsec } = await import('../index.mjs')
    global.evaluator = new Parsec()

    console.log('📦 Initializing WebAssembly module for tests...')
    await global.evaluator.initialize(global.WASM_PATH)
    console.log('✅ WebAssembly module initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize WebAssembly module:', error)
    throw error
  }
}, global.TEST_TIMEOUT)

// Setup before each test
beforeEach(() => {
  // Reset any test-specific state
  if (global.evaluator && !global.evaluator.isReady()) {
    throw new Error('WebAssembly module is not ready for testing')
  }
})

// Cleanup after each test
afterEach(() => {
  // Clean up any test-specific resources
  // Currently no cleanup needed
})

// Cleanup after all tests
afterAll(() => {
  const testDuration = Date.now() - global.testStartTime
  console.log(`🎯 All tests completed in ${testDuration}ms`)

  // Clean up global resources
  global.evaluator = null
})

// Utility function to create a test evaluator instance
export async function createTestEvaluator() {
  if (global.evaluator && global.evaluator.isReady()) {
    return global.evaluator
  }
  throw new Error('Global evaluator not initialized. Check test setup.')
}

// Utility function for floating-point comparison with tolerance
export function assertAlmostEqual(actual, expected, tolerance = 1e-10, message = '') {
  const diff = Math.abs(actual - expected)
  if (diff > tolerance) {
    throw new Error(
      `Expected ${actual} to be approximately ${expected} (tolerance: ${tolerance})${message ? `: ${message}` : ''}`
    )
  }
  return true
}

// Utility function to check if a result is a valid direct value
export function isValidDirectValue(result) {
  return (
    typeof result === 'number' ||
    typeof result === 'string' ||
    typeof result === 'boolean'
  )
}

// Export test utilities
export const testUtils = {
  createTestEvaluator,
  assertAlmostEqual,
  isValidDirectValue,
  EPSILON: 1e-10,
  WASM_PATH: global.WASM_PATH,
}
