/**
 * JavaScript Wrapper for Equations-Parser WebAssembly Module
 * 
 * This module provides a clean JavaScript interface for the equations-parser C++ library
 * compiled to WebAssembly. It handles module loading, error handling, and provides
 * type-aware equation evaluation with comprehensive mathematical functions.
 */

class EquationsParserWrapper {
    constructor() {
        this.module = null;
        this.isLoaded = false;
        this.loadingPromise = null;
    }

    /**
     * Initialize and load the WebAssembly module
     * @param {string} wasmPath - Path to the WASM JavaScript file
     * @returns {Promise<void>} Promise that resolves when module is loaded
     */
    async initialize(wasmPath = '../wasm/equations_parser.js') {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this._loadModule(wasmPath);
        return this.loadingPromise;
    }

    /**
     * Internal method to load the WebAssembly module
     * @private
     */
    async _loadModule(wasmPath) {
        try {
            console.log('🔄 Loading Equations-Parser WebAssembly module from:', wasmPath);
            
            // Import the Emscripten-generated ES6 module
            const moduleImport = await import(wasmPath);
            console.log('🔍 Module import successful');
            
            // With EXPORT_ES6=1, Emscripten exports the factory as default
            let moduleFactory = moduleImport.default;
            
            if (typeof moduleFactory !== 'function') {
                console.log('🔍 Available exports:', Object.keys(moduleImport));
                throw new Error(`Expected factory function, got ${typeof moduleFactory}`);
            }
            
            console.log('🔄 Initializing WebAssembly module...');
            
            // Initialize the module with the factory function
            this.module = await moduleFactory();
            
            console.log('🔍 Module initialized successfully');
            
            // Test if the module loaded correctly
            if (typeof this.module.test_equations_parser_loaded !== 'function') {
                console.log('Available module functions:', Object.keys(this.module));
                throw new Error('test_equations_parser_loaded function not found in module');
            }
            
            const testResult = this.module.test_equations_parser_loaded();
            if (testResult !== 42) {
                throw new Error(`Equations-parser test failed - expected 42, got ${testResult}`);
            }
            
            this.isLoaded = true;
            console.log('✅ Equations-Parser WebAssembly module loaded successfully');
            console.log('🧪 Module test result:', testResult);
            
        } catch (error) {
            console.error('❌ Failed to load Equations-Parser WebAssembly module:', error);
            console.error('Error details:', error);
            throw new Error(`Equations-Parser WebAssembly module loading failed: ${error.message}`);
        }
    }

    /**
     * Check if the module is loaded and ready to use
     * @returns {boolean} True if module is loaded
     */
    isReady() {
        return this.isLoaded && this.module !== null;
    }

    /**
     * Evaluate a mathematical equation using the equations-parser library
     * @param {string} equation - The mathematical expression to evaluate
     * @returns {Object} Result object with value, type, and error information
     * 
     * @example
     * // Basic arithmetic
     * evaluateEquation("2 + 3 * 4") // → {value: "14", type: "i", success: true}
     * 
     * @example
     * // Trigonometric functions
     * evaluateEquation("sin(pi/2)") // → {value: "1", type: "f", success: true}
     * 
     * @example
     * // String functions
     * evaluateEquation("concat('Hello', ' World')") // → {value: "Hello World", type: "s", success: true}
     * 
     * @example
     * // Conditional expressions
     * evaluateEquation("5 > 3 ? 'yes' : 'no'") // → {value: "yes", type: "s", success: true}
     * 
     * @example
     * // Error case
     * evaluateEquation("5 / 0") // → {error: "Division by zero", success: false}
     */
    evaluateEquation(equation) {
        this._checkReady();
        
        try {
            // Input validation
            if (typeof equation !== 'string') {
                throw new Error('Equation must be a string');
            }
            
            if (!equation.trim()) {
                throw new Error('Equation cannot be empty');
            }
            
            console.log(`🧮 JS: Evaluating equation: "${equation}"`);
            
            // Call the C++ function which returns JSON
            const jsonResult = this.module.eval_equation(equation);
            console.log(`🧮 JS: Raw result from C++: ${jsonResult}`);
            
            // Parse the JSON response
            const parsedResult = JSON.parse(jsonResult);
            
            if (parsedResult.error) {
                console.log(`❌ JS: Equation evaluation error: ${parsedResult.error}`);
                return {
                    error: parsedResult.error,
                    success: false,
                    equation: equation
                };
            } else {
                console.log(`✅ JS: Equation evaluated successfully: ${parsedResult.val} (type: ${parsedResult.type})`);
                return {
                    value: parsedResult.val,
                    type: parsedResult.type,
                    success: true,
                    equation: equation
                };
            }
            
        } catch (error) {
            console.error('❌ Error in evaluateEquation:', error);
            return {
                error: `JavaScript evaluation error: ${error.message}`,
                success: false,
                equation: equation
            };
        }
    }

    /**
     * Get information about supported equation types and functions
     * @returns {Object} Information about supported functions and operators
     */
    getSupportedFunctions() {
        return {
            // Basic arithmetic operators
            arithmetic: [
                '+ (addition)', '- (subtraction)', '* (multiplication)', '/ (division)', 
                '^ (power)', '% (modulo)', '+= -= *= /= (assignment operators)'
            ],
            
            // Trigonometric functions
            trigonometric: [
                'sin(x) - sine function',
                'cos(x) - cosine function', 
                'tan(x) - tangent function',
                'asin(x) - arc sine',
                'acos(x) - arc cosine',
                'atan(x) - arc tangent',
                'atan2(y,x) - arc tangent with quadrant fix'
            ],
            
            // Hyperbolic functions
            hyperbolic: [
                'sinh(x) - hyperbolic sine',
                'cosh(x) - hyperbolic cosine',
                'tanh(x) - hyperbolic tangent',
                'asinh(x) - inverse hyperbolic sine',
                'acosh(x) - inverse hyperbolic cosine',
                'atanh(x) - inverse hyperbolic tangent'
            ],
            
            // Logarithmic and exponential functions
            logarithmic: [
                'ln(x) - natural logarithm',
                'log(x) - natural logarithm',
                'log10(x) - logarithm base 10',
                'log2(x) - logarithm base 2',
                'exp(x) - exponential function (e^x)'
            ],
            
            // Root and power functions
            mathematical: [
                'abs(x) - absolute value',
                'sqrt(x) - square root',
                'cbrt(x) - cube root',
                'pow(x,y) - raise x to the power of y',
                'hypot(x,y) - length of vector (x,y)',
                'round(x) - round to nearest integer',
                'round_decimal(x,y) - round x to y decimal places',
                'fmod(x,y) - floating point remainder of x/y',
                'remainder(x,y) - IEEE remainder of x/y'
            ],
            
            // String manipulation functions
            string: [
                'concat(s1,s2) - concatenate two strings',
                'length(s) - string length',
                'toupper(s) - convert to uppercase',
                'tolower(s) - convert to lowercase',
                'left(s,n) - get leftmost n characters',
                'right(s,n) - get rightmost n characters',
                'str2number(s) - convert string to number',
                'number(x) - convert value to number',
                'string(x) - convert value to string',
                'contains(s1,s2) - check if s1 contains s2',
                'link(text,url) - create HTML link',
                'link(text,url,download) - create download link',
                'default_value(val,default) - return default if val is null',
                'calculate(s) - evaluate equation in string'
            ],
            
            // Matrix functions
            matrix: [
                'ones(rows,cols) - matrix of ones',
                'zeros(rows,cols) - matrix of zeros',
                'eye(n) - identity matrix',
                'size(matrix) - matrix dimensions',
                "transpose - matrix transpose operator (')"
            ],
            
            // Array/vector functions
            array: [
                'sizeof(a) - number of elements in array'
            ],
            
            // Date functions
            date: [
                'current_date() - current date (YYYY-MM-DD)',
                'daysdiff(date1,date2) - difference in days',
                'hoursdiff(datetime1,datetime2) - difference in hours',
                'add_days(date,days) - add days to date',
                'weekyear(date) - week number of year',
                'weekday(date) - day of week (0=Sunday)',
                'weekday(date,locale) - localized day name'
            ],
            
            // Time functions
            time: [
                'current_time() - current time (HH:MM:SS)',
                'current_time(offset) - current time with GMT offset',
                'timediff(time1,time2) - difference in hours'
            ],
            
            // Utility functions
            utility: [
                'mask(pattern,number) - apply formatting mask',
                'regex(text,pattern) - regex pattern matching',
                'parserid() - parser version information'
            ],
            
            // Comparison and logical operators
            comparison: [
                '> < >= <= (comparison operators)',
                '== != (equality operators)',
                '&& || (logical AND, OR)',
                'and or (alternative logical operators)',
                '! (logical NOT)',
                '& | (bitwise AND, OR)',
                '<< >> (bit shift operators)'
            ],
            
            // Conditional expressions
            conditional: [
                '? : (ternary operator)',
                'condition ? true_value : false_value'
            ],
            
            // Mathematical constants
            constants: [
                'pi - π (3.14159...)',
                'e - Euler\'s number (2.71828...)',
                'null - null value'
            ],
            
            // Aggregation functions
            aggregation: [
                'min(x1,x2,...) - minimum value',
                'max(x1,x2,...) - maximum value',
                'sum(x1,x2,...) - sum of all values',
                'avg(x1,x2,...) - average of all values'
            ],
            
            // Type casting
            casting: [
                '(float) - cast to floating point',
                '(int) - cast to integer',
                '! (factorial) - postfix operator'
            ]
        };
    }

    /**
     * Run comprehensive tests of the equations-parser functionality
     * @returns {Object} Test results with success/failure information
     */
    async runComprehensiveTests() {
        this._checkReady();
        
        console.log('🧪 Running comprehensive equations-parser tests...');
        const results = {
            passed: 0,
            failed: 0,
            tests: [],
            errors: []
        };

        const testCases = [
            // Basic arithmetic
            { equation: '2 + 3', expected: '5', description: 'Basic addition' },
            { equation: '10 - 4', expected: '6', description: 'Basic subtraction' },
            { equation: '7 * 8', expected: '56', description: 'Basic multiplication' },
            { equation: '15 / 3', expected: '5', description: 'Basic division' },
            { equation: '2 ^ 3', expected: '8', description: 'Power operation' },
            { equation: '2 + 3 * 4', expected: '14', description: 'Order of operations' },
            { equation: '(2 + 3) * 4', expected: '20', description: 'Parentheses precedence' },
            
            // Mathematical functions
            { equation: 'sin(0)', expected: '0', description: 'Sine of zero' },
            { equation: 'cos(0)', expected: '1', description: 'Cosine of zero' },
            { equation: 'sqrt(16)', expected: '4', description: 'Square root' },
            { equation: 'abs(-5)', expected: '5', description: 'Absolute value' },
            { equation: 'round(3.6)', expected: '4', description: 'Rounding function' },
            
            // String functions (if supported)
            { equation: 'length("test")', expected: '4', description: 'String length' },
            
            // Conditional expressions
            { equation: '5 > 3', expected: 'true', description: 'Greater than comparison', allowBooleanString: true },
            { equation: '2 < 1', expected: 'false', description: 'Less than comparison', allowBooleanString: true },
        ];

        for (const testCase of testCases) {
            try {
                const result = this.evaluateEquation(testCase.equation);
                const testResult = {
                    equation: testCase.equation,
                    description: testCase.description,
                    expected: testCase.expected,
                    actual: result.success ? result.value : result.error,
                    passed: false
                };

                if (result.success) {
                    // Handle different value formats (some might be "1.000000" vs "1")
                    const actualValue = result.value.toString();
                    const expectedValue = testCase.expected.toString();
                    
                    if (testCase.allowBooleanString) {
                        // For boolean comparisons, accept various formats
                        testResult.passed = actualValue.toLowerCase() === expectedValue.toLowerCase() ||
                                          (actualValue === '1' && expectedValue === 'true') ||
                                          (actualValue === '0' && expectedValue === 'false');
                    } else {
                        // For numeric comparisons, handle floating point precision
                        const actualNum = parseFloat(actualValue);
                        const expectedNum = parseFloat(expectedValue);
                        
                        if (!isNaN(actualNum) && !isNaN(expectedNum)) {
                            testResult.passed = Math.abs(actualNum - expectedNum) < 0.0001;
                        } else {
                            testResult.passed = actualValue === expectedValue;
                        }
                    }
                } else {
                    testResult.passed = false;
                    testResult.error = result.error;
                }

                if (testResult.passed) {
                    results.passed++;
                } else {
                    results.failed++;
                    results.errors.push(`${testCase.description}: Expected ${testCase.expected}, got ${testResult.actual}`);
                }

                results.tests.push(testResult);

            } catch (error) {
                results.failed++;
                results.errors.push(`${testCase.description}: Test execution error - ${error.message}`);
            }
        }

        console.log(`🧪 Test results: ${results.passed} passed, ${results.failed} failed`);
        return results;
    }

    /**
     * Check if module is ready, throw error if not
     * @private
     */
    _checkReady() {
        if (!this.isReady()) {
            throw new Error('Equations-Parser WebAssembly module is not loaded. Call initialize() first.');
        }
    }
}

// Export for both ES6 modules and CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EquationsParserWrapper;
} else if (typeof define === 'function' && define.amd) {
    define(() => EquationsParserWrapper);
} else {
    // Browser global
    window.EquationsParserWrapper = EquationsParserWrapper;
}

// Also export as default for ES6 import
export default EquationsParserWrapper;
