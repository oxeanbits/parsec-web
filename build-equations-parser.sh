#!/bin/bash

# Equations-Parser WebAssembly Build Script for Phase 2
# This script compiles the equations-parser C++ library to WebAssembly using Emscripten

set -e  # Exit on any error

echo "🧮 Building Equations-Parser WebAssembly module..."
echo "=================================================="

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

echo "📁 Input files:"
echo "   - cpp/equations_parser_wrapper.cpp (WebAssembly wrapper)"
echo "   - equations-parser/parser/*.cpp (equations-parser library)"
echo "📁 Output directory: wasm/"

# Collect all equations-parser source files
PARSER_SOURCES=$(find equations-parser/parser -name "*.cpp" -type f | tr '\n' ' ')
echo "📋 Found equations-parser sources: $PARSER_SOURCES"

# Compile equations-parser library + WebAssembly wrapper
# Key Emscripten flags explained:
# -s WASM=1                   : Generate WebAssembly instead of asm.js
# -s EXPORTED_FUNCTIONS       : Export specific C functions to JavaScript
# -s EXPORTED_RUNTIME_METHODS : Export runtime methods like ccall, cwrap
# -s ALLOW_MEMORY_GROWTH=1    : Allow memory to grow dynamically
# -s MODULARIZE=1             : Wrap output in a function for import/require
# -s EXPORT_NAME="EquationsParserModule" : Name of the exported module
# -s EXPORT_ES6=1             : Use ES6 module syntax (import/export)
# --bind                      : Enable C++ class/function bindings
# -O2                         : Optimize for speed and size
# -g                          : Include debug symbols
# -s ENVIRONMENT=web          : Optimize for browser environment only
# -s SINGLE_FILE=1            : Embed WASM binary inside JS file
# -I equations-parser/parser  : Include directory for headers

echo "🔧 Compiling with Emscripten..."

emcc cpp/equations_parser_wrapper.cpp $PARSER_SOURCES \
    -I equations-parser/parser \
    -std=c++17 \
    -s WASM=1 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="EquationsParserModule" \
    -s EXPORT_ES6=1 \
    --bind \
    -O2 \
    -g \
    -s ENVIRONMENT=web \
    -s SINGLE_FILE=1 \
    -o wasm/equations_parser.js

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "Generated files:"
    ls -la wasm/equations_parser.js
    echo ""
    echo "📋 Next steps:"
    echo "1. The equations-parser WASM module is embedded in wasm/equations_parser.js"
    echo "2. Update JavaScript wrapper to use eval_equation function"
    echo "3. Update HTML test to use the new equations-parser module"
    echo "4. Test with real mathematical expressions!"
    echo ""
    echo "🧪 Test examples you can now use:"
    echo '   - "sin(pi/2)" → 1.0'
    echo '   - "sqrt(16)" → 4.0'
    echo '   - "2 + 3 * 4" → 14.0'
    echo '   - "concat(\"Hello\", \" \", \"World\")" → "Hello World"'
    echo '   - "5 > 3 ? \"yes\" : \"no\"" → "yes"'
else
    echo "❌ Build failed!"
    exit 1
fi