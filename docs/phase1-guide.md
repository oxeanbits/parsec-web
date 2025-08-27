# Phase 1: WebAssembly + JavaScript Integration Guide

This guide provides complete instructions for setting up and testing the basic WebAssembly integration with C++ math functions.

## 🎯 Goals

- Create C++ functions that can be called from JavaScript
- Compile C++ to WebAssembly using Emscripten
- Create a JavaScript wrapper for easy integration
- Test everything with a complete HTML interface

## 📁 Project Structure

```
parsec-web/
├── cpp/                    # C++ source files
│   └── math_functions.cpp  # Basic math functions (sum, multiply)
├── js/                     # JavaScript wrapper libraries
│   └── math_wrapper.js     # Clean JS interface for WASM functions
├── html/                   # Test HTML files
│   └── test.html          # Interactive test page
├── wasm/                   # Generated WebAssembly files (created by build)
├── docs/                   # Documentation
│   └── phase1-guide.md    # This guide
└── build.sh              # Compilation script
```

## 🔧 Prerequisites

### 1. Install Emscripten

**Option A: Using emsdk (Recommended)**
```bash
# Download and install emsdk
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

# Install and activate the latest version
./emsdk install latest
./emsdk activate latest

# Set up environment variables
source ./emsdk_env.sh
```

**Option B: Package Manager**
```bash
# Ubuntu/Debian
sudo apt-get install emscripten

# macOS with Homebrew
brew install emscripten
```

### 2. Verify Installation
```bash
# Check if Emscripten is available
emcc --version

# Should output something like:
# emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 3.1.x
```

## 🚀 Building the Project

### Step 1: Build WebAssembly Module
```bash
# From the project root directory
chmod +x build.sh
./build.sh
```

**Expected Output:**
```
🔧 Building WebAssembly module...
==================================
📁 Input file: cpp/math_functions.cpp
📁 Output directory: wasm/
✅ Build successful!
Generated files:
-rw-r--r-- 1 user user 234567 date time math_functions.js
```

### Step 2: Start Local Server
Since we're using ES6 modules, you need to serve files over HTTP:

```bash
# Option 1: Python (if available)
python3 -m http.server 8000

# Option 2: Node.js
npx serve -s . -p 8000

# Option 3: Any other static file server
```

### Step 3: Open Test Page
Open your browser and navigate to:
```
http://localhost:8000/html/test.html
```

## 🧪 Testing the Implementation

### Automated Testing

1. **Page Load Test**: The page should load without errors
2. **Module Loading**: You should see "✅ WebAssembly module ready!" status
3. **Function Tests**: Click "Run All Tests" to execute comprehensive tests

### Manual Testing

1. **Sum Function**: 
   - Enter values like `5.5` and `3.2`
   - Click "Calculate"
   - Should display result: `8.7`

2. **Multiply Function**:
   - Enter values like `4` and `7`
   - Click "Calculate"
   - Should display result: `28`

### Console Output
Check the "Console Output" section on the test page for detailed logs:
```
[timestamp] C++: WASM module loaded successfully!
[timestamp] C++: Computing sum(5.5, 3.2) = 8.7
[timestamp] JS: Result = 8.7
```

## 🔍 Understanding the Components

### 1. C++ Functions (`cpp/math_functions.cpp`)

The C++ code uses Emscripten bindings to expose functions to JavaScript:

```cpp
// Using extern "C" for simple C-style exports
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    double sum(double a, double b) { /* ... */ }
}

// Using Embind for more advanced C++ features
EMSCRIPTEN_BINDINGS(math_module) {
    function("sum", &sum);
    function("multiply", &multiply);
}
```

**Key Points:**
- `EMSCRIPTEN_KEEPALIVE`: Prevents function from being optimized out
- `extern "C"`: C-style linkage for simple integration
- `EMSCRIPTEN_BINDINGS`: C++ style bindings with type safety

### 2. Emscripten Build Flags (`build.sh`)

Important compilation flags explained:

```bash
emcc cpp/math_functions.cpp \
    -s WASM=1                    # Generate WebAssembly (not asm.js)
    -s MODULARIZE=1              # Create importable module
    -s EXPORT_NAME="MathModule"  # Module name for imports
    --bind                       # Enable Embind C++ bindings
    -s SINGLE_FILE=1            # Embed WASM in JS for easy distribution
    -O2                         # Optimization level 2
```

### 3. JavaScript Wrapper (`js/math_wrapper.js`)

The wrapper provides:
- **Async Loading**: Proper module initialization
- **Error Handling**: Comprehensive error checking
- **Type Safety**: Input validation
- **Clean API**: Simple function calls

```javascript
// Initialize the module
const mathWrapper = new MathWasmWrapper();
await mathWrapper.initialize();

// Use the functions
const result = mathWrapper.sum(5, 3);
```

### 4. HTML Test Interface (`html/test.html`)

Features:
- **Interactive UI**: Manual testing with input fields
- **Automated Tests**: Comprehensive test suite
- **Console Output**: Real-time logging display
- **Error Handling**: Clear error messages

## ❌ Troubleshooting

### Common Issues

**1. "emcc: command not found"**
```bash
# Make sure Emscripten is installed and in PATH
source /path/to/emsdk/emsdk_env.sh
```

**2. "Module loading failed"**
- Check that you're serving files over HTTP (not file://)
- Verify `wasm/math_functions.js` was generated
- Check browser console for detailed error messages

**3. "Cross-origin requests blocked"**
```bash
# Start a local server instead of opening file directly
python3 -m http.server 8000
```

**4. Functions not working**
- Verify in browser console that module loaded successfully
- Check if test function returns 42
- Look for C++ console output in the Console Output section

### Debug Steps

1. **Check Build Output**: Ensure `build.sh` completes without errors
2. **Verify Generated Files**: Check that `wasm/math_functions.js` exists
3. **Browser Console**: Look for JavaScript errors
4. **Network Tab**: Verify all files are loading correctly

## ✅ Success Criteria

Phase 1 is successful when:

1. ✅ **Build completes without errors**
2. ✅ **Test page loads and shows "WebAssembly module ready!"**
3. ✅ **Manual tests work with expected results**
4. ✅ **Automated tests pass without errors**
5. ✅ **Console shows C++ debug output**
6. ✅ **No JavaScript errors in browser console**

## 🔄 Next Steps

Once Phase 1 is working:

1. **Understand the Architecture**: Review how data flows from JavaScript → WASM → C++
2. **Experiment**: Try adding new functions or modifying existing ones
3. **Prepare for Phase 2**: We'll integrate this into Flutter Web using `dart:js_interop`

## 📝 Key Learnings

After completing Phase 1, you should understand:

- How to compile C++ to WebAssembly with Emscripten
- How to create JavaScript bindings for WASM functions
- How to handle async module loading in browsers
- How to create a clean API wrapper for WASM integration
- How to test and debug WASM applications

This foundation will be crucial for the Flutter integration in subsequent phases.