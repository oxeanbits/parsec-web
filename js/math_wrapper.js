/**
 * JavaScript Wrapper for WebAssembly Math Functions
 *
 * This module provides a clean JavaScript interface for the C++ math functions
 * compiled to WebAssembly. It handles module loading, error handling, and
 * provides both Promise-based and callback-based APIs.
 */

class MathWasmWrapper {
  constructor() {
    this.module = null
    this.isLoaded = false
    this.loadingPromise = null
  }

  /**
   * Initialize and load the WebAssembly module
   * @param {string} wasmPath - Path to the WASM JavaScript file
   * @returns {Promise<void>} Promise that resolves when module is loaded
   */
  initialize(wasmPath = '../wasm/math_functions.js') {
    if (this.loadingPromise) {
      return this.loadingPromise
    }

    this.loadingPromise = this._loadModule(wasmPath)
    return this.loadingPromise
  }

  /**
   * Internal method to load the WebAssembly module
   * @private
   */
  async _loadModule(wasmPath) {
    try {
      console.log('🔄 Loading WebAssembly module from:', wasmPath)

      // Import the Emscripten-generated ES6 module
      const moduleImport = await import(wasmPath)
      console.log('🔍 Module import successful')

      // With EXPORT_ES6=1, Emscripten exports the factory as default
      const moduleFactory = moduleImport.default

      if (typeof moduleFactory !== 'function') {
        console.log('🔍 Available exports:', Object.keys(moduleImport))
        throw new Error(`Expected factory function, got ${typeof moduleFactory}`)
      }

      console.log('🔄 Initializing WebAssembly module...')

      // Initialize the module with the factory function
      this.module = await moduleFactory()

      console.log('🔍 Module initialized successfully')

      // Test if the module loaded correctly
      if (typeof this.module.test_wasm_loaded !== 'function') {
        console.log('Available module functions:', Object.keys(this.module))
        throw new Error('test_wasm_loaded function not found in module')
      }

      const testResult = this.module.test_wasm_loaded()
      if (testResult !== 42) {
        throw new Error(`WASM module test failed - expected 42, got ${testResult}`)
      }

      this.isLoaded = true
      console.log('✅ WebAssembly module loaded successfully')
      console.log('🧪 Module test result:', testResult)
    } catch (error) {
      console.error('❌ Failed to load WebAssembly module:', error)
      console.error('Error details:', error)
      throw new Error(`WebAssembly module loading failed: ${error.message}`)
    }
  }

  /**
   * Check if the module is loaded and ready to use
   * @returns {boolean} True if module is loaded
   */
  isReady() {
    return this.isLoaded && this.module !== null
  }

  /**
   * Add two numbers using the WebAssembly function
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   * @throws {Error} If module is not loaded or function fails
   */
  sum(a, b) {
    this._checkReady()

    try {
      // Convert inputs to numbers to ensure type safety
      const numA = Number(a)
      const numB = Number(b)

      if (!isFinite(numA) || !isFinite(numB)) {
        throw new Error('Invalid input: both parameters must be finite numbers')
      }

      console.log(`📊 JS: Calling sum(${numA}, ${numB})`)
      const result = this.module.sum(numA, numB)
      console.log(`📊 JS: Result = ${result}`)

      return result
    } catch (error) {
      console.error('❌ Error in sum function:', error)
      throw new Error(`Sum calculation failed: ${error.message}`)
    }
  }

  /**
   * Multiply two numbers using the WebAssembly function
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Product of a and b
   * @throws {Error} If module is not loaded or function fails
   */
  multiply(a, b) {
    this._checkReady()

    try {
      // Convert inputs to numbers to ensure type safety
      const numA = Number(a)
      const numB = Number(b)

      if (!isFinite(numA) || !isFinite(numB)) {
        throw new Error('Invalid input: both parameters must be finite numbers')
      }

      console.log(`📊 JS: Calling multiply(${numA}, ${numB})`)
      const result = this.module.multiply(numA, numB)
      console.log(`📊 JS: Result = ${result}`)

      return result
    } catch (error) {
      console.error('❌ Error in multiply function:', error)
      throw new Error(`Multiply calculation failed: ${error.message}`)
    }
  }

  /**
   * Run a comprehensive test of all functions
   * @returns {Object} Test results
   */
  runTests() {
    this._checkReady()

    console.log('🧪 Running comprehensive tests...')
    const results = {
      sum: {},
      multiply: {},
      errors: [],
    }

    // Test sum function
    try {
      results.sum.basic = this.sum(2, 3)
      results.sum.decimals = this.sum(1.5, 2.7)
      results.sum.negative = this.sum(-5, 3)
      results.sum.zero = this.sum(0, 42)
    } catch (error) {
      results.errors.push(`Sum test failed: ${error.message}`)
    }

    // Test multiply function
    try {
      results.multiply.basic = this.multiply(4, 5)
      results.multiply.decimals = this.multiply(2.5, 1.2)
      results.multiply.negative = this.multiply(-3, 7)
      results.multiply.zero = this.multiply(0, 100)
    } catch (error) {
      results.errors.push(`Multiply test failed: ${error.message}`)
    }

    console.log('🧪 Test results:', results)
    return results
  }

  /**
   * Check if module is ready, throw error if not
   * @private
   */
  _checkReady() {
    if (!this.isReady()) {
      throw new Error('WebAssembly module is not loaded. Call initialize() first.')
    }
  }
}

// Export for both ES6 modules and CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathWasmWrapper
} else if (typeof define === 'function' && define.amd) {
  define(() => MathWasmWrapper)
} else {
  // Browser global
  window.MathWasmWrapper = MathWasmWrapper
}

// Also export as default for ES6 import
export default MathWasmWrapper
