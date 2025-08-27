#!/bin/bash

# WebAssembly Build Script for Phase 1
# This script compiles C++ code to WebAssembly using Emscripten

set -e  # Exit on any error

echo "🔧 Building WebAssembly module..."
echo "=================================="

# Check if Emscripten is available
if ! command -v emcc &> /dev/null; then
    echo "❌ Error: Emscripten (emcc) not found!"
    echo "Please install Emscripten:"
    echo "1. Download from: https://emscripten.org/docs/getting_started/downloads.html"
    echo "2. Or install via emsdk:"
    echo "   git clone https://github.com/emscripten-core/emsdk.git"
    echo "   cd emsdk"
    echo "   ./emsdk install latest"
    echo "   ./emsdk activate latest"
    echo "   source ./emsdk_env.sh"
    exit 1
fi

# Create wasm output directory if it doesn't exist
mkdir -p wasm

echo "📁 Input file: cpp/math_functions.cpp"
echo "📁 Output directory: wasm/"

# Compile C++ to WebAssembly
# Key Emscripten flags explained:
# -s WASM=1                   : Generate WebAssembly instead of asm.js
# -s EXPORTED_FUNCTIONS       : Export specific C functions to JavaScript
# -s EXPORTED_RUNTIME_METHODS : Export runtime methods like ccall, cwrap
# -s ALLOW_MEMORY_GROWTH=1    : Allow memory to grow dynamically
# -s MODULARIZE=1             : Create a module that can be imported
# -s EXPORT_NAME="MathModule" : Name of the module when imported
# --bind                      : Enable Embind for C++ bindings
# -O2                         : Optimization level 2 (good balance of speed/size)
# -g                          : Include debug information
# -s ENVIRONMENT=web          : Target web environment
# -s SINGLE_FILE=1            : Embed WASM in JS file for easier distribution

emcc cpp/math_functions.cpp \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS='["_sum", "_multiply", "_test_wasm_loaded"]' \
    -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="MathModule" \
    -s EXPORT_ES6=1 \
    --bind \
    -O2 \
    -g \
    -s ENVIRONMENT=web \
    -s SINGLE_FILE=1 \
    -o wasm/math_functions.js

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "Generated files:"
    ls -la wasm/
    echo ""
    echo "📋 Next steps:"
    echo "1. The WASM module is embedded in wasm/math_functions.js"
    echo "2. You can now use this in your HTML/JavaScript files"
    echo "3. Run the HTML test to verify everything works"
else
    echo "❌ Build failed!"
    exit 1
fi