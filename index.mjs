/**
 * Parsec Equations Library - ES6 Module Entry Point
 *
 * A generalized JavaScript library that connects to equations-parser WebAssembly
 * for cross-platform, high-performance equation evaluation.
 *
 * This entry point provides ES6 module compatibility for modern JavaScript environments,
 * bundlers, and Node.js with ES modules support.
 */

import ParsecEvaluator from './js/equations_parser_wrapper.js'

/**
 * EquationsEvaluator - Main class for evaluating mathematical expressions
 *
 * @example
 * // Basic usage
 * import { EquationsEvaluator } from 'parsec-equations-lib';
 *
 * const evaluator = new EquationsEvaluator();
 * await evaluator.initialize();
 *
 * const result = evaluator.eval('2 + 3 * sin(pi/2)');
 * console.log(result.value); // 5
 *
 * @example
 * // Default import
 * import EquationsEvaluator from 'parsec-equations-lib';
 *
 * const evaluator = new EquationsEvaluator();
 * await evaluator.initialize();
 */
class EquationsEvaluator extends ParsecEvaluator {
  constructor() {
    super()
    this._version = '1.0.0'
    this._description = 'Fast mathematical expression evaluator powered by WebAssembly'
  }

  /**
   * Get library version
   * @returns {string} Version string
   */
  getVersion() {
    return this._version
  }

  /**
   * Get library description
   * @returns {string} Description string
   */
  getDescription() {
    return this._description
  }

  /**
   * Get library information
   * @returns {Object} Library metadata
   */
  getInfo() {
    return {
      name: 'parsec-equations-lib',
      version: this._version,
      description: this._description,
      repository: 'https://github.com/your-org/parsec-web',
      supportedPlatforms: [
        'Browser (ES6)',
        'Node.js (CommonJS/ES6)',
        'React/Vue/Angular',
        'Flutter Web',
        'Webpack/Rollup/Vite',
      ],
      features: [
        'WebAssembly performance',
        'Offline capability',
        'Cross-platform compatibility',
        'Comprehensive mathematical functions',
        'String manipulation',
        'Date/time operations',
        'Complex numbers',
        'Array operations',
        'Type-safe results',
      ],
    }
  }

  /**
   * Batch evaluate multiple equations
   * @param {string[]} equations - Array of equations to evaluate
   * @returns {Object[]} Array of evaluation results
   *
   * @example
   * const results = evaluator.evaluateBatch([
   *   '2 + 2',
   *   'sqrt(16)',
   *   'concat("Hello", " World")'
   * ]);
   */
  evaluateBatch(equations) {
    if (!Array.isArray(equations)) {
      throw new Error('equations must be an array of strings')
    }

    return equations.map((equation, index) => {
      try {
        const result = this.eval(equation)
        return {
          index,
          equation,
          ...result,
        }
      } catch (error) {
        return {
          index,
          equation,
          success: false,
          error: error.message,
        }
      }
    })
  }

  /**
   * Evaluate equation with timeout
   * @param {string} equation - Mathematical expression to evaluate
   * @param {number} timeoutMs - Timeout in milliseconds (default: 5000)
   * @returns {Promise<Object>} Evaluation result
   */
  async evaluateWithTimeout(equation, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Equation evaluation timed out after ${timeoutMs}ms`))
      }, timeoutMs)

      try {
        const result = this.eval(equation)
        clearTimeout(timeout)
        resolve(result)
      } catch (error) {
        clearTimeout(timeout)
        reject(error)
      }
    })
  }
}

// Export both named and default
export { EquationsEvaluator }
export default EquationsEvaluator
