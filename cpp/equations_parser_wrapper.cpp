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
    logEquationEvaluation(equation);
    
    try {
        const std::string result = evaluateEquationSafely(equation);
        logSuccessfulEvaluation(result);
        return result;
        
    } catch (const std::exception& e) {
        return handleKnownException(e);
    } catch (...) {
        return handleUnknownException();
    }
}

/**
 * Test function to verify WASM module is loaded correctly
 * @return Test confirmation number
 */
int test_equations_parser_loaded() {
    logModuleLoadSuccess();
    
    try {
        return runBasicFunctionalityTest();
    } catch (...) {
        logTestFailure();
        return getFailureIndicator();
    }
}

void logEquationEvaluation(const std::string& equation) {
    std::cout << "C++: Evaluating equation: " << equation << std::endl;
}

std::string evaluateEquationSafely(const std::string& equation) {
    return EquationsParser::CalcJson(equation);
}

void logSuccessfulEvaluation(const std::string& result) {
    std::cout << "C++: Result: " << result << std::endl;
}

std::string handleKnownException(const std::exception& e) {
    std::cerr << "C++: Exception caught: " << e.what() << std::endl;
    return createErrorJson("C++ exception: " + std::string(e.what()));
}

std::string handleUnknownException() {
    std::cerr << "C++: Unknown exception caught" << std::endl;
    return createErrorJson("Unknown C++ exception occurred");
}

std::string createErrorJson(const std::string& errorMessage) {
    return "{\"error\": \"" + errorMessage + "\"}";
}

void logModuleLoadSuccess() {
    std::cout << "C++: Equations-parser WASM module loaded successfully!" << std::endl;
}

int runBasicFunctionalityTest() {
    const std::string TEST_EQUATION = "2 + 2";
    const std::string testResult = EquationsParser::Calc(TEST_EQUATION);
    
    std::cout << "C++: Basic test (" << TEST_EQUATION << ") = " << testResult << std::endl;
    return getSuccessIndicator();
}

void logTestFailure() {
    std::cerr << "C++: Test failed - equations-parser not working properly" << std::endl;
}

int getSuccessIndicator() {
    return 42;
}

int getFailureIndicator() {
    return -1;
}

using namespace emscripten;

EMSCRIPTEN_BINDINGS(equations_parser_module) {
    function("eval_equation", &eval_equation);
    function("test_equations_parser_loaded", &test_equations_parser_loaded);
}
