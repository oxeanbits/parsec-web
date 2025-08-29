/**
 * Parsec Equations Library - CommonJS Entry Point
 *
 * A generalized JavaScript library that connects to equations-parser WebAssembly
 * for cross-platform, high-performance equation evaluation.
 *
 * This entry point provides CommonJS compatibility for Node.js and bundlers
 * that require CommonJS modules.
 */

'use strict'

let EquationsEvaluator

// Check if we're in a Node.js environment
if (typeof module !== 'undefined' && typeof require !== 'undefined') {
  // Node.js environment - use dynamic import for ES module
  let evaluatorPromise = null

  const loadEvaluator = async () => {
    if (!evaluatorPromise) {
      evaluatorPromise = import('./js/equations_parser_wrapper.js').then(module => module.default)
    }
    return evaluatorPromise
  }

  // Create a wrapper that loads the ES module dynamically
  class EquationsEvaluatorWrapper {
    constructor() {
      this._evaluator = null
      this._initialized = false
    }

    async initialize(wasmPath) {
      if (!this._evaluator) {
        const EvaluatorClass = await loadEvaluator()
        this._evaluator = new EvaluatorClass()
      }
      return this._evaluator.initialize(wasmPath)
    }

    // Proxy all methods to the internal evaluator
    eval(equation) {
      if (!this._evaluator) {
        throw new Error('Evaluator not initialized. Call initialize() first.')
      }
      return this._evaluator.eval(equation)
    }

    isReady() {
      return this._evaluator ? this._evaluator.isReady() : false
    }

    getSupportedFunctions() {
      if (!this._evaluator) {
        throw new Error('Evaluator not initialized. Call initialize() first.')
      }
      return this._evaluator.getSupportedFunctions()
    }

    async runComprehensiveTests() {
      if (!this._evaluator) {
        throw new Error('Evaluator not initialized. Call initialize() first.')
      }
      return this._evaluator.runComprehensiveTests()
    }
  }

  EquationsEvaluator = EquationsEvaluatorWrapper
} else {
  // Browser environment - fallback to global or throw error
  if (typeof window !== 'undefined' && window.Parsec) {
    EquationsEvaluator = window.Parsec
  } else {
    throw new Error(
      'Parsec WebAssembly module not found. Please ensure the module is properly loaded.'
    )
  }
}

// Export for CommonJS
module.exports = EquationsEvaluator
module.exports.EquationsEvaluator = EquationsEvaluator
module.exports.default = EquationsEvaluator

// Metadata
module.exports.version = require('./package.json').version
module.exports.description = 'Fast mathematical expression evaluator powered by WebAssembly'
