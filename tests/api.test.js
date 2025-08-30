/**
 * API Methods Tests
 * 
 * Tests for enhanced API methods including batch evaluation, 
 * timeout functionality, and other API features.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { testUtils, createTestEvaluator, assertAlmostEqual } from './setup.js'

describe('API Methods', () => {
  let parsec

  beforeAll(async () => {
    parsec = await createTestEvaluator()
  })

  describe('Basic API', () => {
    it('should be ready after initialization', () => {
      expect(parsec.isReady()).toBe(true)
    })

    it('should have version information', () => {
      const version = parsec.getVersion()
      expect(typeof version).toBe('string')
      expect(version).toBe('1.0.0')
    })

    it('should have description', () => {
      const description = parsec.getDescription()
      expect(typeof description).toBe('string')
      expect(description).toContain('WebAssembly')
    })

    it('should provide comprehensive info', () => {
      const info = parsec.getInfo()
      expect(typeof info).toBe('object')
      expect(info).toHaveProperty('name', 'parsec-web')
      expect(info).toHaveProperty('version', '1.0.0')
      expect(info).toHaveProperty('description')
      expect(info).toHaveProperty('repository')
      expect(info).toHaveProperty('supportedPlatforms')
      expect(info).toHaveProperty('features')
      expect(Array.isArray(info.supportedPlatforms)).toBe(true)
      expect(Array.isArray(info.features)).toBe(true)
    })
  })

  describe('Batch Evaluation', () => {
    it('should evaluate multiple equations successfully', () => {
      const equations = ['2 + 3', '4 * 5', 'sqrt(16)']
      const results = parsec.evaluateBatch(equations)
      
      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(3)
      
      expect(results[0]).toEqual({
        index: 0,
        equation: '2 + 3',
        value: 5,
        success: true
      })
      
      expect(results[1]).toEqual({
        index: 1,
        equation: '4 * 5',
        value: 20,
        success: true
      })
      
      expect(results[2]).toEqual({
        index: 2,
        equation: 'sqrt(16)',
        value: 4,
        success: true
      })
    })

    it('should handle mixed success and failure cases', () => {
      const equations = ['2 + 3', 'invalid_function()', 'sqrt(9)']
      const results = parsec.evaluateBatch(equations)
      
      expect(results).toHaveLength(3)
      
      // First should succeed
      expect(results[0].success).toBe(true)
      expect(results[0].value).toBe(5)
      
      // Second should fail
      expect(results[1].success).toBe(false)
      expect(results[1]).toHaveProperty('error')
      expect(typeof results[1].error).toBe('string')
      
      // Third should succeed
      expect(results[2].success).toBe(true)
      expect(results[2].value).toBe(3)
    })

    it('should handle empty array', () => {
      const results = parsec.evaluateBatch([])
      expect(Array.isArray(results)).toBe(true)
      expect(results).toHaveLength(0)
    })

    it('should throw error for non-array input', () => {
      expect(() => parsec.evaluateBatch("not an array")).toThrow('equations must be an array of strings')
      expect(() => parsec.evaluateBatch(null)).toThrow('equations must be an array of strings')
      expect(() => parsec.evaluateBatch(123)).toThrow('equations must be an array of strings')
    })

    it('should handle different result types', () => {
      const equations = [
        '2 + 3',           // number
        '"hello"',         // string  
        '5 > 3',           // boolean
        'pi'               // float
      ]
      const results = parsec.evaluateBatch(equations)
      
      expect(results[0].value).toBe(5)
      expect(typeof results[0].value).toBe('number')
      
      expect(results[1].value).toBe('hello')
      expect(typeof results[1].value).toBe('string')
      
      expect(results[2].value).toBe(true)
      expect(typeof results[2].value).toBe('boolean')
      
      expect(typeof results[3].value).toBe('number')
      assertAlmostEqual(results[3].value, Math.PI, 1e-10)
    })
  })

  describe('Timeout Evaluation', () => {
    it('should evaluate simple equations within timeout', async () => {
      const result = await parsec.evaluateWithTimeout('2 + 3', 1000)
      expect(result).toBe(5)
    })

    it('should evaluate complex equations within timeout', async () => {
      const result = await parsec.evaluateWithTimeout('sin(pi/2) + cos(0)', 1000)
      assertAlmostEqual(result, 2, 1e-10)
    })

    it('should use default timeout when not specified', async () => {
      const result = await parsec.evaluateWithTimeout('sqrt(16)')
      expect(result).toBe(4)
    })

    it('should handle different result types', async () => {
      const numberResult = await parsec.evaluateWithTimeout('42')
      expect(numberResult).toBe(42)
      expect(typeof numberResult).toBe('number')

      const stringResult = await parsec.evaluateWithTimeout('"test"')
      expect(stringResult).toBe('test')
      expect(typeof stringResult).toBe('string')

      const booleanResult = await parsec.evaluateWithTimeout('true')
      expect(booleanResult).toBe(true)
      expect(typeof booleanResult).toBe('boolean')
    })

    it('should reject on invalid equations', async () => {
      await expect(parsec.evaluateWithTimeout('invalid_function()', 1000))
        .rejects
        .toThrow()
    })

    it('should handle very short timeout', async () => {
      // Even with a very short timeout, simple operations should complete
      const result = await parsec.evaluateWithTimeout('2 + 2', 1)
      expect(result).toBe(4)
    })
  })

  describe('Supported Functions', () => {
    it('should return comprehensive function categories', () => {
      const functions = parsec.getSupportedFunctions()
      
      expect(typeof functions).toBe('object')
      expect(functions).toHaveProperty('arithmetic')
      expect(functions).toHaveProperty('trigonometric')
      expect(functions).toHaveProperty('hyperbolic')
      expect(functions).toHaveProperty('logarithmic')
      expect(functions).toHaveProperty('mathematical')
      expect(functions).toHaveProperty('string')
      expect(functions).toHaveProperty('comparison')
      expect(functions).toHaveProperty('conditional')
      expect(functions).toHaveProperty('constants')
      
      // Each category should be an array
      Object.values(functions).forEach(category => {
        expect(Array.isArray(category)).toBe(true)
      })
      
      // Should have some basic functions
      expect(functions.arithmetic).toContain('+ (addition)')
      expect(functions.trigonometric).toContain('sin(x) - sine function')
      expect(functions.constants).toContain('pi - π (3.14159...)')
    })
  })

  describe('Comprehensive Tests', () => {
    it('should run comprehensive tests', async () => {
      const testResults = await parsec.runComprehensiveTests()
      
      expect(typeof testResults).toBe('object')
      expect(testResults).toHaveProperty('passed')
      expect(testResults).toHaveProperty('failed')
      expect(testResults).toHaveProperty('tests')
      expect(testResults).toHaveProperty('errors')
      
      expect(typeof testResults.passed).toBe('number')
      expect(typeof testResults.failed).toBe('number')
      expect(Array.isArray(testResults.tests)).toBe(true)
      expect(Array.isArray(testResults.errors)).toBe(true)
      
      // Should have run some tests
      expect(testResults.passed + testResults.failed).toBeGreaterThan(0)
      
      // Each test should have the right structure
      if (testResults.tests.length > 0) {
        const test = testResults.tests[0]
        expect(test).toHaveProperty('equation')
        expect(test).toHaveProperty('description')
        expect(test).toHaveProperty('expected')
        expect(test).toHaveProperty('actual')
        expect(test).toHaveProperty('passed')
        expect(typeof test.passed).toBe('boolean')
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle evaluation errors gracefully', () => {
      expect(() => parsec.eval('undefined_function()')).toThrow()
      // Note: these operations return special values instead of throwing
      expect(parsec.eval('1 / 0')).toBe(Infinity)
      expect(parsec.eval('sqrt(-1)')).toBeNaN()
    })

    it('should provide meaningful error messages', () => {
      try {
        parsec.eval('undefined_function()')
        expect(false).toBe(true) // Should not reach here
      } catch (error) {
        // Error might be a string or number, not necessarily an Error object
        const errorMessage = error.message || error.toString() || String(error)
        expect(typeof errorMessage).toBe('string')
        expect(errorMessage.length).toBeGreaterThan(0)
      }
    })
  })
})