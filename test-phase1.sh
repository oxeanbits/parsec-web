#!/bin/bash

# Phase 1 Comprehensive Test Script
# This script verifies all components of Phase 1 are properly set up

set -e

echo "🧪 Phase 1 Implementation Test"
echo "==============================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    ((TOTAL_TESTS++))
    
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Detailed test function with output
run_detailed_test() {
    local test_name="$1"
    local test_command="$2"
    ((TOTAL_TESTS++))
    
    echo -e "${BLUE}Testing: $test_name${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        ((TESTS_PASSED++))
        echo ""
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        ((TESTS_FAILED++))
        echo ""
        return 1
    fi
}

echo "1. 📁 Directory Structure Tests"
echo "--------------------------------"

run_test "Project root directory exists" "[ -d '.' ]"
run_test "cpp/ directory exists" "[ -d 'cpp' ]"
run_test "js/ directory exists" "[ -d 'js' ]"
run_test "html/ directory exists" "[ -d 'html' ]"
run_test "docs/ directory exists" "[ -d 'docs' ]"
run_test "wasm/ directory exists" "[ -d 'wasm' ]"

echo ""
echo "2. 📄 Required Files Tests"
echo "---------------------------"

run_test "C++ source file exists" "[ -f 'cpp/math_functions.cpp' ]"
run_test "JavaScript wrapper exists" "[ -f 'js/math_wrapper.js' ]"
run_test "HTML test page exists" "[ -f 'html/test.html' ]"
run_test "Build script exists" "[ -f 'build.sh' ]"
run_test "Documentation exists" "[ -f 'docs/phase1-guide.md' ]"
run_test "README.md exists" "[ -f 'README.md' ]"
run_test "Build script is executable" "[ -x 'build.sh' ]"

echo ""
echo "3. 📝 File Content Validation"
echo "------------------------------"

run_test "C++ file contains sum function" "grep -q 'double sum(' cpp/math_functions.cpp"
run_test "C++ file contains multiply function" "grep -q 'double multiply(' cpp/math_functions.cpp"
run_test "C++ file contains Emscripten bindings" "grep -q 'EMSCRIPTEN_BINDINGS' cpp/math_functions.cpp"
run_test "JavaScript wrapper contains MathWasmWrapper class" "grep -q 'class MathWasmWrapper' js/math_wrapper.js"
run_test "HTML test contains interactive elements" "grep -q 'input.*number' html/test.html"
run_test "Build script contains emcc command" "grep -q 'emcc.*cpp/math_functions.cpp' build.sh"

echo ""
echo "4. 🔧 Development Environment"
echo "------------------------------"

if command -v emcc >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Emscripten is installed${NC}"
    emcc --version | head -1
    EMSCRIPTEN_AVAILABLE=true
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Emscripten not found in PATH${NC}"
    echo "   Install instructions available in docs/phase1-guide.md"
    EMSCRIPTEN_AVAILABLE=false
    ((TESTS_FAILED++))
fi
((TOTAL_TESTS++))

if command -v python3 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Python3 available for local server${NC}"
    ((TESTS_PASSED++))
elif command -v python >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Python available for local server${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  Python not found - install for local server${NC}"
    ((TESTS_FAILED++))
fi
((TOTAL_TESTS++))

echo ""
echo "5. 🏗️ Build Test (if Emscripten available)"
echo "--------------------------------------------"

if [ "$EMSCRIPTEN_AVAILABLE" = true ]; then
    echo "Attempting to build WebAssembly module..."
    if ./build.sh; then
        echo -e "${GREEN}✅ Build completed successfully${NC}"
        ((TESTS_PASSED++))
        
        # Check if output files were created
        if [ -f "wasm/math_functions.js" ]; then
            echo -e "${GREEN}✅ WebAssembly JavaScript file generated${NC}"
            ((TESTS_PASSED++))
            
            # Check file size (should be reasonable)
            SIZE=$(stat --format="%s" wasm/math_functions.js)
            if [ "$SIZE" -gt 1000 ]; then
                echo -e "${GREEN}✅ Generated file has reasonable size ($SIZE bytes)${NC}"
                ((TESTS_PASSED++))
            else
                echo -e "${RED}❌ Generated file seems too small ($SIZE bytes)${NC}"
                ((TESTS_FAILED++))
            fi
            TOTAL_TESTS=$((TOTAL_TESTS + 1))
        else
            echo -e "${RED}❌ WebAssembly JavaScript file not generated${NC}"
            ((TESTS_FAILED++))
        fi
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
    else
        echo -e "${RED}❌ Build failed${NC}"
        ((TESTS_FAILED++))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
else
    echo -e "${YELLOW}⚠️  Skipping build test - Emscripten not available${NC}"
fi

echo ""
echo "6. 🌐 Web Server Test"
echo "----------------------"

# Test if we can start a local server (kill it quickly)
if command -v python3 >/dev/null 2>&1; then
    echo "Testing Python3 HTTP server startup..."
    if timeout 2s python3 -m http.server 8000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Python3 server can start${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${YELLOW}⚠️  Python3 server test inconclusive${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  Python3 not available for server test${NC}"
    ((TESTS_FAILED++))
fi
((TOTAL_TESTS++))

echo ""
echo "📊 Test Results Summary"
echo "========================"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All tests passed! Phase 1 is ready for testing.${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Build the project: ./build.sh"
    echo "2. Start local server: python3 -m http.server 8000"
    echo "3. Open browser to: http://localhost:8000/html/test.html"
    echo "4. Verify all functionality works as expected"
elif [ $TESTS_PASSED -gt $((TOTAL_TESTS / 2)) ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Most tests passed, but some issues need attention.${NC}"
    echo "Check the failed tests above and refer to docs/phase1-guide.md"
else
    echo ""
    echo -e "${RED}❌ Multiple critical issues found.${NC}"
    echo "Please review the failed tests and fix issues before proceeding."
fi

echo ""
echo "📚 Documentation: docs/phase1-guide.md"
echo "🔧 Build Script: ./build.sh"
echo "🧪 Test Page: html/test.html"

exit $TESTS_FAILED