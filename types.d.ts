/**
 * Type definitions for parsec-web
 *
 * A generalized JavaScript library that connects to equations-parser WebAssembly
 * for cross-platform, high-performance equation evaluation.
 */

export interface EvaluationResult {
  /** The evaluated value */
  value: number | string | boolean
  /** Type indicator from equations-parser */
  type: 'i' | 'f' | 'b' | 's' | 'int' | 'float' | 'boolean' | 'string' | 'complex' | 'matrix'
  /** Whether evaluation was successful */
  success: true
  /** The original equation */
  equation: string
}

export interface EvaluationError {
  /** Error message describing the failure */
  error: string
  /** Whether evaluation was successful */
  success: false
  /** The original equation */
  equation: string
}

export type EquationResult = EvaluationResult | EvaluationError

export interface BatchEvaluationResult extends EquationResult {
  /** Index in the batch array */
  index: number
}

export interface TestResult {
  /** The equation that was tested */
  equation: string
  /** Description of the test */
  description: string
  /** Expected result */
  expected: string
  /** Actual result obtained */
  actual: string
  /** Whether the test passed */
  passed: boolean
  /** Error message if test failed */
  error?: string
}

export interface ComprehensiveTestResults {
  /** Number of tests that passed */
  passed: number
  /** Number of tests that failed */
  failed: number
  /** Array of individual test results */
  tests: TestResult[]
  /** Array of error messages */
  errors: string[]
}

export interface FunctionCategories {
  /** Basic arithmetic operators */
  arithmetic: string[]
  /** Trigonometric functions */
  trigonometric: string[]
  /** Hyperbolic functions */
  hyperbolic: string[]
  /** Logarithmic and exponential functions */
  logarithmic: string[]
  /** Mathematical utility functions */
  mathematical: string[]
  /** String manipulation functions */
  string: string[]
  /** Matrix functions */
  matrix: string[]
  /** Array/vector functions */
  array: string[]
  /** Date functions */
  date: string[]
  /** Time functions */
  time: string[]
  /** Utility functions */
  utility: string[]
  /** Comparison and logical operators */
  comparison: string[]
  /** Conditional expressions */
  conditional: string[]
  /** Mathematical constants */
  constants: string[]
  /** Aggregation functions */
  aggregation: string[]
  /** Type casting */
  casting: string[]
}

export interface LibraryInfo {
  /** Library name */
  name: string
  /** Library version */
  version: string
  /** Library description */
  description: string
  /** Repository URL */
  repository: string
  /** Supported platforms */
  supportedPlatforms: string[]
  /** Library features */
  features: string[]
}

/**
 * Main Parsec class for evaluating mathematical expressions
 */
export default class Parsec {
  /**
   * Create a new Parsec instance
   */
  constructor()

  /**
   * Initialize the WebAssembly module
   * @param wasmPath - Optional path to the WebAssembly module
   * @returns Promise that resolves when initialization is complete
   */
  initialize(wasmPath?: string): Promise<void>

  /**
   * Check if the evaluator is ready to use
   * @returns True if the module is loaded and ready
   */
  isReady(): boolean

  /**
   * Evaluate a mathematical expression
   * @param equation - The mathematical expression to evaluate
   * @returns The evaluated result with proper JavaScript type conversion
   * @throws Error if the equation is invalid or evaluation fails
   *
   * @example
   * ```typescript
   * const result = parsec.eval('2 + 3 * 4');
   * console.log(result); // 14 (number)
   * 
   * const text = parsec.eval('concat("Hello", " World")');
   * console.log(text); // "Hello World" (string)
   * 
   * const bool = parsec.eval('5 > 3');
   * console.log(bool); // true (boolean)
   * ```
   */
  eval(equation: string): number | string | boolean

  /**
   * Evaluate multiple equations in batch
   * @param equations - Array of equations to evaluate
   * @returns Array of evaluation results with index information
   *
   * @example
   * ```typescript
   * const results = evaluator.evaluateBatch([
   *   '2 + 2',
   *   'sqrt(16)',
   *   'concat("Hello", " World")'
   * ]);
   * ```
   */
  evaluateBatch(equations: string[]): BatchEvaluationResult[]

  /**
   * Evaluate equation with timeout protection
   * @param equation - Mathematical expression to evaluate
   * @param timeoutMs - Timeout in milliseconds (default: 5000)
   * @returns Promise that resolves with the evaluated result
   */
  evaluateWithTimeout(equation: string, timeoutMs?: number): Promise<number | string | boolean>

  /**
   * Get information about supported functions and operators
   * @returns Object containing categorized function information
   */
  getSupportedFunctions(): FunctionCategories

  /**
   * Run comprehensive tests of the equations-parser functionality
   * @returns Promise that resolves with test results
   */
  runComprehensiveTests(): Promise<ComprehensiveTestResults>

  /**
   * Get library version
   * @returns Version string
   */
  getVersion(): string

  /**
   * Get library description
   * @returns Description string
   */
  getDescription(): string

  /**
   * Get comprehensive library information
   * @returns Library metadata object
   */
  getInfo(): LibraryInfo
}

/**
 * Named export of the main class
 */
export { Parsec }

/**
 * Legacy EquationsEvaluator class name for backward compatibility
 * @deprecated Use Parsec instead
 */
export class EquationsEvaluator extends Parsec {}

// Module augmentation for global usage
declare global {
  interface Window {
    Parsec?: typeof Parsec
    EquationsEvaluator?: typeof Parsec
  }
}

// CommonJS compatibility
export = Parsec
