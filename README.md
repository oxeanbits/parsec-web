<p align="center">
  <img src="https://i.imgur.com/e1u6sR2.png" alt="Parsec Web Logo" width="200" height="400"/>
</p>

<p align="center">
  Parsec Web: A very light parser for equations using WebAssembly in `equations-parser`
</p>

A comprehensive guide for integrating C++ libraries with web & flutter applications through WebAssembly.

## 🎯 Project Overview

This project demonstrates how to:
- Compile C++ code to WebAssembly using Emscripten
- Create JavaScript wrappers for WASM functions  
- Integrate WASM libraries with Flutter Web using `dart:js_interop`
- Build cross-platform architecture for both Web and Mobile
- Replace example functions with real C++ library integration

## 🏗️ Implementation Phases

### ✅ Phase 1: Basic WebAssembly + JavaScript Integration
**Status**: Ready for testing  
**Goal**: Create and test C++ → WASM → JavaScript integration

**What's included:**
- C++ math functions (`sum`, `multiply`)
- Emscripten compilation setup
- JavaScript wrapper library
- Interactive HTML test page
- Comprehensive documentation

**Files:**
- `cpp/math_functions.cpp` - C++ source with Emscripten bindings
- `build.sh` - Compilation script with detailed flags
- `js/math_wrapper.js` - JavaScript wrapper with error handling
- `html/test.html` - Interactive test interface
- `docs/phase1-guide.md` - Complete setup and testing guide

### 🔄 Phase 2: Equations-Parser WebAssembly Integration *(Coming Next)*
**Goal**: Compile the real equations-parser C++ library to WebAssembly and create comprehensive web testing interface

**What's planned:**
- Replace toy math functions with actual equations-parser library
- Set up equations-parser as git submodule from `https://github.com/oxeanbits/equations-parser`
- Compile comprehensive equation evaluation functionality to WASM
- Create enhanced HTML + JavaScript testing interface
- Support for all equations-parser features:
  - **Math functions**: sin, cos, tan, ln, log, abs, sqrt, pow, exp, etc.
  - **String functions**: concat, length, toupper, tolower, left, right
  - **Complex functions**: real, imag, conj, arg, norm  
  - **Array functions**: sizeof, eye, ones, zeros
  - **Date functions**: current_date, daysdiff, hoursdiff
  - **Advanced operators**: ternary operators, comparison operators
  - **Multiple return types**: integer/float, string, boolean values

### 🔄 Phase 3: Flutter Web Integration *(Planned)*
**Goal**: Integrate equations-parser WASM with Flutter Web using `dart:js_interop`

**What's planned:**
- Clean Flutter project structure
- `dart:js_interop` bindings for equations-parser functions
- Abstract service interface for cross-platform compatibility
- Web-specific service implementation
- Flutter UI for equation input and result display

### 🔄 Phase 4: Cross-Platform Mobile Integration *(Optional)*
**Goal**: Extend Flutter integration to mobile/desktop platforms

**What's planned:**
- Factory pattern for service creation
- Platform detection (web vs mobile/desktop)
- Platform Channel integration for mobile/desktop
- Unified Flutter interface across all platforms

## 🚀 Quick Start (Phase 1)

### Prerequisites
- Emscripten SDK installed and configured
- Modern web browser with ES6 module support
- Local web server (Python, Node.js, or similar)

### Build and Test
```bash
# 1. Build the WebAssembly module
chmod +x build.sh
./build.sh

# 2. Start local server
python3 -m http.server 8000

# 3. Open test page
# Navigate to: http://localhost:8000/html/test.html
```

### Expected Results
- ✅ "WebAssembly module ready!" status message
- ✅ Interactive math function testing
- ✅ Automated test suite passes
- ✅ C++ debug output in console

## 📁 Project Structure

```
parsec-web/
├── cpp/                    # C++ source files
│   └── math_functions.cpp  # Math functions with WASM bindings
├── js/                     # JavaScript wrapper libraries  
│   └── math_wrapper.js     # Clean API for WASM functions
├── html/                   # Test HTML files
│   └── test.html           # Interactive test interface
├── wasm/                   # Generated WASM files (build output)
├── docs/                   # Documentation
│   └── phase1-guide.md     # Detailed Phase 1 instructions
├── build.sh                # Emscripten compilation script
└── README.md               # This file
```

## 🧪 Testing Strategy

Each phase includes comprehensive testing:

1. **Build Verification**: Compilation succeeds without errors
2. **Module Loading**: WASM loads correctly in browser
3. **Function Testing**: All exposed functions work as expected
4. **Error Handling**: Proper error messages and recovery
5. **Performance**: Acceptable execution times
6. **Cross-Browser**: Works in major browsers

## 📚 Documentation

- **[Phase 1 Guide](docs/phase1-guide.md)**: Complete setup and testing instructions
- **Code Comments**: Detailed explanations in all source files
- **Build Scripts**: Self-documenting with extensive comments

## 🔧 Technical Stack

- **C++17+**: Modern C++ with Emscripten bindings
- **Emscripten**: Latest version with optimized flags
- **JavaScript ES6**: Modules, async/await, classes
- **WebAssembly**: Binary format with JavaScript integration
- **Equations-Parser Library**: Advanced mathematical expression evaluator
- **Flutter 3.x**: `dart:js_interop` for web integration (Phase 3+)

## 📈 Progress Overview

1. ✅ **Phase 1 Complete**: Toy WebAssembly integration working
2. **Phase 2 Ready**: Integrate real equations-parser C++ library
   - Set up equations-parser as git submodule
   - Replace toy functions with comprehensive equation evaluation
   - Create advanced testing interface for all equation types
3. **Phase 3**: Flutter Web integration with equations-parser WASM
4. **Phase 4**: Cross-platform mobile/desktop integration (optional)
