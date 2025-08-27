# WebAssembly + Flutter Integration Project

A comprehensive implementation guide for integrating C++ libraries with Flutter applications through WebAssembly.

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

### 🔄 Phase 2: Flutter Web Integration *(Coming Next)*
- Clean Flutter project structure
- `dart:js_interop` bindings
- Abstract service interface
- Web-specific service implementation

### 🔄 Phase 3: Cross-Platform Architecture *(Planned)*
- Factory pattern for service creation
- Platform detection (web vs mobile)
- Mobile service stubs for Platform Channels

### 🔄 Phase 4: Real Equations-Parser Integration *(Planned)*
- Integration with actual equations-parser C++ library
- String input handling for mathematical expressions
- Enhanced error handling for complex equations

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
│   └── test.html          # Interactive test interface
├── wasm/                   # Generated WASM files (build output)
├── docs/                   # Documentation
│   └── phase1-guide.md    # Detailed Phase 1 instructions
├── build.sh               # Emscripten compilation script
└── README.md              # This file
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
- **Flutter 3.x**: `dart:js_interop` for web integration (Phases 2+)

## 🎯 Success Criteria

**Phase 1 Complete When:**
- [x] C++ functions compile to WASM without errors
- [x] JavaScript can call WASM functions successfully  
- [x] HTML test page demonstrates full functionality
- [x] All tests pass with expected outputs
- [x] Documentation is complete and accurate

## 🔄 Next Steps

1. **Test Phase 1**: Follow the guide in `docs/phase1-guide.md`
2. **Verify Everything Works**: Run all tests and confirm output
3. **Request Phase 2**: Once Phase 1 is confirmed working
4. **Iterative Development**: Each phase builds on the previous

## 🤝 Contributing

This is a structured learning project with phases designed to be completed sequentially. Each phase should be fully tested before moving to the next.

## 📄 License

This project is for educational purposes, demonstrating WebAssembly integration patterns.