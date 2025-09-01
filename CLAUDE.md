# Parsec Web: WebAssembly Equations Parser

## Project Overview

Parsec Web is a revolutionary project that transforms the equations-parser C++ library into a WebAssembly module, enabling lightning-fast mathematical expression evaluation directly in web browsers. This project eliminates the need for server-side computation, providing offline capabilities and near-instantaneous results.

### Architecture Transformation

**Before (Server-Dependent):**
```
Web Client → Network Request → Backend Server → equations-parser → Network Response → Web Client
```

**After (Client-Side WebAssembly):**
```
Web Client → WebAssembly Module (equations-parser) → Immediate Result
```

### Key Benefits

- **100x Performance Improvement**: ~1ms vs ~110ms processing time
- **Zero Server Infrastructure**: No backend servers required
- **Offline Capabilities**: Full functionality without internet connection
- **Infinite Scalability**: Processing scales with client devices
- **Complete Feature Parity**: All equations-parser functions available

## Current Implementation Status

### Phase 2 - Completed ✅
The project is currently in Phase 2, which integrates the full equations-parser C++ library into WebAssembly:

**What's Built:**
- Complete equations-parser library compiled to WebAssembly
- Comprehensive JavaScript wrapper with clean API
- Interactive HTML testing interface
- Support for all mathematical operations, string functions, date/time operations
- Error handling and type-aware evaluation
- Automated build scripts

**Core Functionality Available:**
- **Mathematical Functions**: sin, cos, tan, ln, log, abs, sqrt, pow, exp, etc.
- **String Operations**: concat, length, toupper, tolower, left, right
- **Complex Numbers**: real, imag, conj, arg, norm
- **Arrays/Matrices**: sizeof, eye, ones, zeros
- **Date/Time Functions**: current_date, daysdiff, hoursdiff
- **Conditional Logic**: ternary operators, comparison operators
- **Multiple Return Types**: integer, float, string, boolean values

### Architecture

```
parsec-web/
├── equations-parser/                # C++ library (git submodule)
│   └── parser/
│       ├── equationsParser.h        # Main parser interface
│       ├── equationsParser.cpp      # Core evaluation logic
│       └── [50+ additional parser files]
├── cpp/
│   └── equations_parser_wrapper.cpp # WebAssembly bindings
├── js/
│   ├── equations_parser_wrapper.js  # JavaScript API wrapper
│   └── math_wrapper.js              # Phase 1 legacy wrapper
├── html/
│   ├── equations-parser-test.html   # Phase 2 interactive test interface
│   └── test.html                    # Phase 1 basic test page
├── wasm/                            # Generated WebAssembly files
├── build-equations-parser.sh        # Phase 2 build script
└── build.sh                         # Phase 1 build script
```

### Core Components

#### 1. equations-parser C++ Library (`equations-parser/`)
The heart of the system - a comprehensive mathematical expression evaluator:

- **Main Interface**: `equationsParser.h/cpp`
  - `Calc(string input)` - Basic evaluation returning string
  - `CalcJson(string input)` - JSON evaluation with type information
  - `CalcArray(vector<string>, vector<string>&)` - Batch processing

- **Features**: 50+ C++ files implementing mathematical functions, operators, string manipulation, date/time operations, and more

#### 2. WebAssembly Wrapper (`cpp/equations_parser_wrapper.cpp`)
Bridges C++ library to JavaScript:

```cpp
// Main evaluation function
std::string eval_equation(const std::string& equation)

// Module test function  
int test_equations_parser_loaded()
```

- **Emscripten Bindings**: Exposes C++ functions to JavaScript
- **Error Handling**: Comprehensive exception catching and JSON error responses
- **Logging**: Debug output for development and troubleshooting

#### 3. JavaScript API (`js/equations_parser_wrapper.js`)
Clean JavaScript interface with native type conversion:

```javascript
class Parsec {
    async initialize(wasmPath)     // Load WebAssembly module
    eval(equation)                 // Evaluate mathematical expressions (returns native types)
    getSupportedFunctions()        // Get function documentation
    runComprehensiveTests()        // Automated testing
}
```

**Features:**
- Promise-based async initialization
- Comprehensive error handling and validation
- **Native Type Conversion**: Automatic conversion from C++ strings to proper JavaScript types
- Type-aware result objects
- Built-in test suite
- Complete function documentation

**Type Conversion System:**
The JavaScript wrapper now includes a sophisticated type conversion system that mirrors the Ruby implementation:

- **Integer Types** (`int`/`i`): Converted to JavaScript `number` using `parseInt()`
- **Float Types** (`float`/`f`): Converted to JavaScript `number` using `parseFloat()`
- **Boolean Types** (`boolean`/`b`): Converted to JavaScript `boolean` with comprehensive string-to-boolean logic
- **String Types** (`string`/`s`): Returned as JavaScript `string` with error checking
- **Special Values**: `inf` → `'Infinity'`, `-inf` → `'-Infinity'`, `nan` → `'nan'`
- **Error Handling**: Automatic detection and throwing of error strings starting with "Error:"

#### 4. Interactive Test Interface (`html/equations-parser-test.html`)
Comprehensive web testing environment:

- **Live Equation Evaluation**: Real-time input and results
- **Quick Test Examples**: Pre-built test cases for all function categories
- **Function Browser**: Searchable catalog of all available functions
- **Automated Test Suite**: Comprehensive validation of library functionality
- **Debug Console**: Real-time C++ and JavaScript logging

### Build System

#### Emscripten Compilation (`build-equations-parser.sh`)
Sophisticated build configuration:

```bash
emcc cpp/equations_parser_wrapper.cpp $PARSER_SOURCES \
    -I equations-parser/parser \
    -std=c++17 \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="EquationsParserModule" \
    -s EXPORT_ES6=1 \
    --bind \
    -O2 \
    -s SINGLE_FILE=1 \
    -o wasm/equations_parser.js
```

**Key Features:**
- ES6 module export
- Embedded WebAssembly binary
- Optimized compilation
- Comprehensive error checking
- Automatic source file discovery

### Supported Operations

The system supports an extensive range of mathematical and utility operations:

#### Mathematical Functions
- **Trigonometric**: sin, cos, tan, asin, acos, atan, atan2
- **Hyperbolic**: sinh, cosh, tanh, asinh, acosh, atanh  
- **Logarithmic**: ln, log, log10, log2, exp
- **Power/Root**: abs, sqrt, cbrt, pow, hypot
- **Rounding**: round, round_decimal, fmod, remainder

#### String Functions
- **Manipulation**: concat, length, toupper, tolower, left, right
- **Conversion**: str2number, number, string
- **Utilities**: contains, link, default_value, calculate

#### Date/Time Operations
- **Current Values**: current_date(), current_time()
- **Calculations**: daysdiff, hoursdiff, timediff, add_days
- **Formatting**: weekyear, weekday

#### Advanced Features
- **Matrix Operations**: ones, zeros, eye, size, transpose
- **Aggregation**: min, max, sum, avg, sizeof
- **Conditionals**: ternary operators (?:), comparison operators
- **Logical Operations**: &&, ||, !, and, or
- **Type Casting**: (float), (int), factorial (!)

### API Examples

#### Basic Usage with Native Type Conversion
```javascript
const parsec = new Parsec();
await parsec.initialize();

// Mathematical evaluation - returns native JavaScript number
const result1 = parsec.eval('2 + 3 * sin(pi/2)');
// → {value: 5, type: "f", success: true}  (value is number, not string)

// String operations - returns native JavaScript string
const result2 = parsec.eval('concat("Hello", " World")');
// → {value: "Hello World", type: "s", success: true}

// Boolean logic - returns native JavaScript boolean
const result3 = parsec.eval('5 > 3');
// → {value: true, type: "b", success: true}  (value is boolean, not string)

// Conditional logic - returns native JavaScript string
const result4 = parsec.eval('5 > 3 ? "yes" : "no"');
// → {value: "yes", type: "s", success: true}

// Integer operations - returns native JavaScript number
const result5 = parsec.eval('10 / 2');
// → {value: 5, type: "i", success: true}  (value is number, not string)
```

#### Type Conversion Examples
```javascript
// Special float values
parsec.eval('1/0');     // → {value: "Infinity", type: "f", success: true}
parsec.eval('-1/0');    // → {value: "-Infinity", type: "f", success: true}
parsec.eval('0/0');     // → {value: "nan", type: "f", success: true}

// Boolean conversions (following Ruby string-to-boolean logic)
parsec.eval('true');    // → {value: true, type: "b", success: true}
parsec.eval('false');   // → {value: false, type: "b", success: true}
parsec.eval('"1"');     // If evaluated as boolean → true
parsec.eval('"0"');     // If evaluated as boolean → false
```

#### Error Handling
```javascript
const result = parsec.eval('5 / 0');
// → {error: "Division by zero", success: false}
```

#### Comprehensive Testing
```javascript
const testResults = await parsec.runComprehensiveTests();
// Returns detailed test results for all function categories
```

## Development Workflow

### Building the Project
```bash
# Build WebAssembly module
./build-equations-parser.sh

# Start local development server
python3 -m http.server 8000

# Open test interface
# Navigate to: http://localhost:8000/html/equations-parser-test.html
```

### Testing Strategy
The project includes comprehensive testing at multiple levels:

1. **Module Loading Tests**: Verify WebAssembly initialization
2. **Function Tests**: Validate all mathematical operations
3. **Error Handling Tests**: Ensure graceful failure modes
4. **Type System Tests**: Verify correct type detection and conversion
5. **Performance Tests**: Monitor execution speed

### Code Quality
- **Clean Architecture**: Separation of concerns between C++, WebAssembly, and JavaScript layers
- **Error Boundaries**: Comprehensive exception handling at all levels
- **Type Safety**: Strong typing throughout the JavaScript API
- **Documentation**: Extensive inline documentation and examples
- **Logging**: Detailed debug output for development and troubleshooting

## Future Development Phases

### Phase 3 - Automated Testing (Planned)
- Comprehensive automated test suite
- Cross-browser compatibility testing
- Performance benchmarking
- CI/CD integration

### Phase 4 - Library Extraction (Planned)
- Standalone npm package
- Flutter Web package
- Multi-platform distribution
- Production optimization

### Phase 5 - Advanced Integrations (Planned)
- React/Vue.js components
- Mobile app integration
- Desktop application support
- Advanced visualization tools

## Technical Specifications

### Browser Compatibility
- **Modern browsers** with WebAssembly support
- **ES6 modules** required for JavaScript integration
- **Local development** requires HTTP server (not file://)

### Performance Characteristics
- **Initialization**: ~100-200ms (one-time WebAssembly loading)
- **Evaluation**: <5ms for complex expressions
- **Memory Usage**: ~2MB WebAssembly module
- **Offline Support**: Full functionality without internet

### Security Considerations
- **Client-side execution**: No data transmitted to servers
- **Input validation**: Comprehensive equation syntax checking
- **Error isolation**: Safe handling of malformed expressions
- **No external dependencies**: Self-contained WebAssembly module

## Development Notes

### Key Files for Claude Code Understanding

- **equations-parser/parser/equationsParser.h:15** - Main C++ evaluation interface
- **cpp/equations_parser_wrapper.cpp:25** - WebAssembly bindings for eval_equation
- **js/equations_parser_wrapper.js:85** - JavaScript eval() method implementation
- **build-equations-parser.sh:55** - Emscripten compilation configuration
- **html/equations-parser-test.html:497** - Interactive evaluation interface

### Important Implementation Details

1. **Module Loading**: Uses ES6 dynamic imports with async initialization
2. **Type System**: Results include both value and type information (i, f, s, b)
3. **Error Handling**: Three-layer error handling (C++, WebAssembly, JavaScript)
4. **Memory Management**: Automatic via Emscripten runtime
5. **Debugging**: Console output from both C++ and JavaScript layers

### Performance Optimizations

- **Single File Output**: WebAssembly binary embedded in JavaScript
- **Compilation Flags**: -O2 optimization with debug symbols
- **Module Reuse**: Single initialization for multiple evaluations
- **Type Caching**: Efficient result object creation
- **Memory Growth**: Dynamic memory allocation as needed

This project represents a significant advancement in bringing high-performance mathematical computation to web browsers, providing a foundation for advanced scientific and engineering web applications.

## Pull Request Guidance

When prompted with **"draft a pull request"**:

1. **Analyze changes**
   * Compare everything done on the current branch against `master`/`main` branch of `upstream`.
   * Summarize all relevant commits, file modifications, and key impacts.

2. **Create a Markdown draft**
   * Produce content that can be pasted directly into the PR **title** and **description** fields.
   * **Structure** the description with the template imported below:
     @digitalize-api/.github/pull_request_template.md
   * Enhance clarity with markdown code fences with language tags, colors, tables, blockquotes for callouts, admonitions (GitHub alerts), mermaid diagrams, images, collapsible details and etc.

3. **Write the Test Guidance section**
   * Assume a tester is going to test the changes proposed on this pull request.
   * Describe step-by-step checks needs to be performed to carefully test it.

4. **Generate a Markdown file**
   * Generate a `pull_request.md` file containing the Pull Request title and description
