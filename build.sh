#!/bin/bash

# WebAssembly Build Script for equations-parser
# This script compiles the equations-parser C++ library to WebAssembly using Emscripten

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

echo "📁 Input directory: cpp/equations-parser/"
echo "📁 Output directory: wasm/"

# Compile equations-parser C++ library to WebAssembly
# Key Emscripten flags explained:
# -s WASM=1                   : Generate WebAssembly instead of asm.js
# -s ALLOW_MEMORY_GROWTH=1    : Allow memory to grow dynamically
# -s MODULARIZE=1             : Wrap output in a function for import/require
# -s EXPORT_NAME="EquationsModule" : Name of the exported module
# -s EXPORT_ES6=1             : Use ES6 module syntax (import/export)
# --bind                      : Enable C++ class/function bindings
# -O2                         : Optimize for speed and size
# -s ENVIRONMENT=web          : Optimize for browser environment only
# -s SINGLE_FILE=1            : Embed WASM binary inside JS file

emcc cpp/equations-parser/src/equations_parser.cpp \
    cpp/equations-parser/src/variable_table.cpp \
    cpp/equations-parser/src/math_functions.cpp \
    cpp/equations-parser/src/string_functions.cpp \
    cpp/equations-parser/src/date_functions.cpp \
    cpp/equations-parser/src/complex_functions.cpp \
    cpp/equations-parser/src/array_functions.cpp \
    cpp/equations_parser_wrapper.cpp \
    -Icpp/equations-parser/include \
    -s WASM=1 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="EquationsModule" \
    -s EXPORT_ES6=1 \
    --bind \
    -O2 \
    -s ENVIRONMENT=web \
    -s SINGLE_FILE=1 \
    -o wasm/equations_parser.js

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "Generated files:"
    ls -la wasm/
    echo ""
    echo "📋 Next steps:"
    echo "1. The WASM module is embedded in wasm/equations_parser.js"
    echo "2. You can now use this with the Parsec wrapper in JavaScript"
    echo "3. Run 'npm test' to verify everything works"
else
    echo "❌ Build failed!"
    exit 1
fi