#include <emscripten/bind.h>
#include <emscripten/emscripten.h>
#include <iostream>
#include <string>

// Include equations-parser library
#include "../equations-parser/parser/equationsParser.h"

/**
 * WebAssembly wrapper for the equations-parser library
 * 
 * This file provides clean C++ functions that can be exported to JavaScript
 * through Emscripten bindings, enabling web-based equation evaluation.
 */

/**
 * Evaluates a mathematical equation and returns the result as JSON
 * @param equation The mathematical expression as a string
 * @return JSON string with result and type information
 * 
 * Example return formats:
 * Success: {"val": "3.14159", "type": "f"}
 * Error:   {"error": "Division by zero"}
 */
std::string eval_equation(const std::string& equation) {
    std::cout << "C++: Evaluating equation: " << equation << std::endl;
    
    try {
        std::string result = EquationsParser::CalcJson(equation);
        std::cout << "C++: Result: " << result << std::endl;
        return result;
        
    } catch (const std::exception& e) {
        std::cerr << "C++: Exception caught: " << e.what() << std::endl;
        return "{\"error\": \"C++ exception: " + std::string(e.what()) + "\"}";
    } catch (...) {
        std::cerr << "C++: Unknown exception caught" << std::endl;
        return "{\"error\": \"Unknown C++ exception occurred\"}";
    }
}

/**
 * Test function to verify WASM module is loaded correctly
 * @return Test confirmation number
 */
int test_equations_parser_loaded() {
    std::cout << "C++: Equations-parser WASM module loaded successfully!" << std::endl;
    
    // Test basic functionality
    try {
        std::string test_result = EquationsParser::Calc("2 + 2");
        std::cout << "C++: Basic test (2 + 2) = " << test_result << std::endl;
        return 42; // Success indicator
    } catch (...) {
        std::cerr << "C++: Test failed - equations-parser not working properly" << std::endl;
        return -1; // Failure indicator
    }
}

// C++ style bindings using Embind
using namespace emscripten;

EMSCRIPTEN_BINDINGS(equations_parser_module) {
    function("eval_equation", &eval_equation);
    function("test_equations_parser_loaded", &test_equations_parser_loaded);
}
