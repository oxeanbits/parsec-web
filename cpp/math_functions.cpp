#include <emscripten/bind.h>
#include <emscripten/emscripten.h>
#include <iostream>

/**
 * Basic mathematical functions for WebAssembly integration testing
 * These functions will be exposed to JavaScript through Emscripten bindings
 */

extern "C" {
    /**
     * Adds two numbers together
     * @param a First number
     * @param b Second number
     * @return Sum of a and b
     */
    EMSCRIPTEN_KEEPALIVE
    double sum(double a, double b) {
        std::cout << "C++: Computing sum(" << a << ", " << b << ") = " << (a + b) << std::endl;
        return a + b;
    }

    /**
     * Multiplies two numbers together
     * @param a First number
     * @param b Second number
     * @return Product of a and b
     */
    EMSCRIPTEN_KEEPALIVE
    double multiply(double a, double b) {
        std::cout << "C++: Computing multiply(" << a << ", " << b << ") = " << (a * b) << std::endl;
        return a * b;
    }

    /**
     * Test function to verify WASM is loaded correctly
     * @return Test confirmation number
     */
    EMSCRIPTEN_KEEPALIVE
    int test_wasm_loaded() {
        std::cout << "C++: WASM module loaded successfully!" << std::endl;
        return 42;
    }
}

// Alternative binding method using Embind (more C++ friendly)
// This allows for more complex types and better integration
using namespace emscripten;

EMSCRIPTEN_BINDINGS(math_module) {
    function("sum", &sum);
    function("multiply", &multiply);
    function("test_wasm_loaded", &test_wasm_loaded);
}