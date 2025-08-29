/**
 * Type definitions for parsec-equations-lib
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
 * Main EquationsEvaluator class for evaluating mathematical expressions
 */
export default class EquationsEvaluator {
  /**
   * Create a new EquationsEvaluator instance
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
   * @returns Result object with value, type, and success information
   *
   * @example
   * ```typescript
   * const result = evaluator.eval('2 + 3 * 4');
   * if (result.success) {
   *   console.log(result.value); // 14
   *   console.log(result.type);  // 'i'
   * }
   * ```
   */
  eval(equation: string): EquationResult

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
   * @returns Promise that resolves with the evaluation result
   */
  evaluateWithTimeout(equation: string, timeoutMs?: number): Promise<EquationResult>

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
export { EquationsEvaluator }

/**
 * Legacy Parsec class name for backward compatibility
 * @deprecated Use EquationsEvaluator instead
 */
export class Parsec extends EquationsEvaluator {}

// Module augmentation for global usage
declare global {
  interface Window {
    EquationsEvaluator?: typeof EquationsEvaluator
    Parsec?: typeof EquationsEvaluator
  }
}

// CommonJS compatibility
export = EquationsEvaluator
