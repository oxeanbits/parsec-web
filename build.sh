#!/bin/bash

# WebAssembly Build Script for Phase 1
# This script compiles C++ code to WebAssembly using Emscripten

set -e  # Exit on any error

echo "🔧 Building WebAssembly module..."
echo "=================================="

# Check if we have local emsdk installation and set it up
if [ -d "./emsdk" ]; then
    echo "🔧 Found local Emscripten SDK..."
    
    # Check if emsdk is already activated
    if [ ! -f "./emsdk/emsdk_env.sh" ] || ! ./emsdk/emsdk list | grep -q "INSTALLED.*latest"; then
        echo "🔧 Installing and activating latest Emscripten..."
        cd emsdk
        ./emsdk install latest
        ./emsdk activate latest
        cd ..
    fi
    
    echo "🔧 Sourcing local Emscripten environment..."
    source ./emsdk/emsdk_env.sh
fi

# Check if Emscripten is available
if ! command -v emcc &> /dev/null; then
    echo "❌ Error: Emscripten (emcc) not found!"
    echo "Please set up Emscripten using the local emsdk:"
    echo "1. The emsdk should already be cloned locally"
    echo "2. Run this build script again - it will auto-install Emscripten"
    echo "3. Or manually run:"
    echo "   cd emsdk"
    echo "   ./emsdk install latest"
    echo "   ./emsdk activate latest"
    echo "   source ./emsdk_env.sh"
    echo "   cd .."
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
# -s MODULARIZE=1             : Wrap output in a function for import/require
# -s EXPORT_NAME="MathModule" : Name of the exported module
# -s EXPORT_ES6=1             : Use ES6 module syntax (import/export)
# --bind                      : Enable C++ class/function bindings
# -O2                         : Optimize for speed and size
# -g                          : Include debug symbols
# -s ENVIRONMENT=web          : Optimize for browser environment only
# -s SINGLE_FILE=1            : Embed WASM binary inside JS file

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