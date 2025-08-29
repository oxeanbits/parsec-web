# CLAUDE.md - Parsec Web Development Guide

## 🎯 Project Vision

**Parsec Web** is a generalized JavaScript library that connects to the equations-parser WebAssembly module (C++ code compiled to WASM) for high-performance, cross-platform equation evaluation.

### Core Purpose
- **Generalization**: Make the library reusable across different JavaScript environments
- **Cross-Platform**: Support frontend projects, Flutter web, Node.js applications  
- **Performance**: Leverage WebAssembly for fast, client-side equation processing
- **Offline-First**: No server dependency, completely self-contained

## 🏗️ Architecture Overview

```
JavaScript Applications  
       ↓
Parsec Web Library (js/equations_parser_wrapper.js)
       ↓  
WebAssembly Module (wasm/equations_parser.js/.wasm)
       ↓
C++ equations-parser Library
```

### Target Platforms
1. **Frontend Projects**: React, Vue, Angular, vanilla JavaScript
2. **Flutter Web**: Via dart:js_interop integration
3. **Node.js Applications**: As importable npm package
4. **Cross-Platform Solutions**: Any JavaScript environment

## 📋 Development Phases

### ✅ Phase 1: Basic WebAssembly Integration
- C++ toy functions compiled to WebAssembly
- JavaScript wrapper library  
- HTML test interface
- **Status**: Complete

### ✅ Phase 2: Equations-Parser Integration  
- Real equations-parser C++ library integration
- Comprehensive WebAssembly compilation
- Full feature support (math, strings, complex, arrays, dates)
- **Status**: Complete

### ✅ Phase 3: Automated Testing Framework
- **Framework**: Vitest (modern, reliable testing framework)
- **Target**: Comprehensive testing through `Parsec.eval(equation)` method
- **Status**: Complete with modern testing approach

#### Test Implementation Strategy
Instead of HTML-based manual testing, Phase 3 uses **Vitest** for:

**Test Categories:**
- **Unit Tests** (8 modules): `tests/unit/`
  - `arithmetic.test.js` - Basic math operations, order of operations
  - `trigonometry.test.js` - sin, cos, tan, inverse functions, hyperbolic
  - `logarithms.test.js` - ln, log, exp functions
  - `strings.test.js` - concat, length, toupper, tolower, substring functions
  - `dates.test.js` - current_date, daysdiff, hoursdiff functions  
  - `complex.test.js` - real, imag, conj, arg, norm functions
  - `arrays.test.js` - sizeof, eye, ones, zeros functions

- **Integration Tests** (2 modules): `tests/integration/`
  - `complex-expressions.test.js` - Multi-function combinations
  - `mixed-types.test.js` - Different return types (number, string, boolean)

- **Error Handling** (3 modules): `tests/errors/`
  - `syntax-errors.test.js` - Invalid equation syntax
  - `runtime-errors.test.js` - Division by zero, invalid arguments
  - `type-errors.test.js` - Type mismatches, invalid operations

- **Performance Benchmarks** (3 modules): `tests/performance/`
  - `simple-ops.bench.js` - Basic arithmetic benchmarking
  - `function-calls.bench.js` - Function call performance
  - `complex-expr.bench.js` - Complex expression performance

**Testing Commands:**
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode for development  
npm run test:coverage    # Generate coverage report
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:performance # Performance benchmarks
```

### 🔄 Phase 4: Generalization for Cross-Platform Use
- **Goal**: Make library truly reusable across platforms
- **Planned**: Refactor for npm package distribution
- **Target**: Support multiple import methods (ES6, CommonJS, UMD)
- **Status**: Next step

### 🔄 Phase 5: Flutter Web Integration
- **Goal**: `dart:js_interop` integration
- **Planned**: Dart bindings for JavaScript library
- **Status**: Future

## 🧪 Testing Philosophy

### Previous Approach (Problematic)
- HTML pages for manual testing
- Browser-based test runners  
- Manual verification of results
- **Issues**: Not reliable, not automatable, not CI/CD friendly

### New Approach (Phase 3 Implementation)
- **Vitest**: Modern testing framework
- **Automated**: Runs via npm scripts
- **Comprehensive**: All equations-parser functionality covered
- **CI/CD Ready**: JSON reports, coverage metrics
- **Cross-Platform**: Works in any Node.js environment

## 🚀 Quick Development Commands

### Build & Compilation
```bash
chmod +x build.sh
./build.sh                    # Compile C++ to WebAssembly
```

### Testing (Vitest Framework)
```bash
npm install                   # Install testing dependencies
npm test                      # Run complete test suite
npm run test:watch            # Development mode with auto-rerun
npm run test:coverage         # Generate coverage report
```

### Development Server
```bash
python3 -m http.server 8000   # Serve files for browser testing
# Access: http://localhost:8000
```

### Linting (To be implemented)
```bash
npm run lint                  # Run linting checks
npm run lint:fix              # Auto-fix linting issues
```

## 📁 Project Structure

```
parsec-web/
├── cpp/                      # C++ source files
│   └── equations-parser/     # Git submodule
├── js/                       # JavaScript library
│   └── equations_parser_wrapper.js  # Main API wrapper
├── wasm/                     # Generated WebAssembly files
├── tests/                    # Vitest test suites
│   ├── unit/                 # Function category tests
│   ├── integration/          # Complex expression tests
│   ├── errors/               # Error handling tests  
│   └── performance/          # Benchmark tests
├── vitest.config.js          # Vitest configuration
├── package.json              # npm configuration with test scripts
├── build.sh                  # WebAssembly compilation
├── README.md                 # Public documentation
└── CLAUDE.md                 # This development guide
```

## 🎯 Key API Usage

### Primary Interface
```javascript
// Import the library
import Parsec from './js/equations_parser_wrapper.js';

// Initialize WebAssembly module  
const parsec = new Parsec();
await parsec.initialize();

// Evaluate equations
const result = parsec.eval('2 + 3 * 4');      // Returns: 14
const trig = parsec.eval('sin(pi/2)');         // Returns: 1
const complex = parsec.eval('real(3+4i)');     // Returns: 3
const string = parsec.eval('concat("a","b")'); // Returns: "ab"
```

### Test Structure Pattern
```javascript
// All tests follow this pattern
class SomeTests {
    constructor(testRunner) {
        this.testRunner = testRunner;
    }
    
    async runTests() {
        const result = await this.testRunner.evaluate('some_equation');
        this.testRunner.assertEqual(result, expected, 'Test description');
    }
}
```

## 🚦 Development Workflow

1. **Make Changes**: Edit C++, JavaScript, or test files
2. **Rebuild WASM**: `./build.sh` (if C++ changed)
3. **Run Tests**: `npm test` (verify functionality)
4. **Fix Issues**: Address any failing tests
5. **Lint Code**: `npm run lint` (maintain code quality)
6. **Update Docs**: Keep README.md and CLAUDE.md current

## 🔍 Debugging & Troubleshooting

### Common Issues
- **Module Loading**: Ensure proper ES6 module paths
- **WebAssembly Path**: Check WASM file path resolution
- **Import Errors**: Verify proper import/export statements
- **Test Failures**: Use `npm run test:watch` for iterative debugging

### Debug Commands  
```bash
# Detailed test output
npm test -- --reporter verbose

# Run single test file
npm test -- arithmetic.test.js

# Debug mode with console output
npm test -- --reporter verbose --silent false
```

This guide serves as the definitive reference for Parsec Web development, focusing on the modern testing approach and cross-platform generalization goals.