/**
 * EvalRaw Function Tests
 *
 * Tests the evalRaw() function which returns raw C++ JSON strings
 * for platform consistency with native implementations.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { createTestEvaluator } from './setup.js'

describe('EvalRaw Function', () => {
  let parsec

  beforeAll(async () => {
    parsec = await createTestEvaluator()
  })

  describe('Basic Arithmetic - Raw JSON Output', () => {
    it('should return JSON for addition operations', () => {
      const result = parsec.evalRaw('2 + 3')
      expect(typeof result).toBe('string')
      
      const parsed = JSON.parse(result)
      expect(parsed).toHaveProperty('val')
      expect(parsed).toHaveProperty('type')
      expect(parsed.val).toBe('5')
      expect(parsed.type).toBe('i')
      expect(parsed).not.toHaveProperty('error')
    })

    it('should return JSON for subtraction operations', () => {
      const result = parsec.evalRaw('10 - 4')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('6')
      expect(parsed.type).toBe('i')
    })

    it('should return JSON for multiplication operations', () => {
      const result = parsec.evalRaw('3 * 4')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('12')
      expect(parsed.type).toBe('i')
    })

    it('should return JSON for division operations', () => {
      const result = parsec.evalRaw('8 / 2')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('4')
      expect(parsed.type).toBe('i')
    })

    it('should return JSON for floating point division', () => {
      const result = parsec.evalRaw('7 / 2')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('3.5')
      expect(parsed.type).toBe('f')
    })
  })

  describe('Special Float Values - Raw JSON Output', () => {
    it('should return JSON for positive infinity', () => {
      const result = parsec.evalRaw('5 / 0')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('inf')
      expect(parsed.type).toBe('f')
    })

    it('should return JSON for negative infinity', () => {
      const result = parsec.evalRaw('-5 / 0')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('-inf')
      expect(parsed.type).toBe('f')
    })

    it('should return JSON for NaN (0/0)', () => {
      const result = parsec.evalRaw('0 / 0')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('-nan')  // C++ actually returns -nan
      expect(parsed.type).toBe('f')
    })

    it('should return JSON for NaN (sqrt of negative)', () => {
      const result = parsec.evalRaw('sqrt(-1)')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('-nan')  // C++ actually returns -nan
      expect(parsed.type).toBe('f')
    })
  })

  describe('Mathematical Functions - Raw JSON Output', () => {
    it('should return JSON for trigonometric functions', () => {
      const result = parsec.evalRaw('sin(0)')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('0')
      expect(parsed.type).toBe('i')  // C++ returns integer for exact zero
    })

    it('should return JSON for cosine function', () => {
      const result = parsec.evalRaw('cos(0)')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('1')
      expect(parsed.type).toBe('i')  // C++ returns integer for exact one
    })

    it('should return JSON for square root', () => {
      const result = parsec.evalRaw('sqrt(16)')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('4')
      expect(parsed.type).toBe('i')  // C++ returns integer for perfect squares
    })

    it('should return JSON for absolute value', () => {
      const result = parsec.evalRaw('abs(-5)')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('5')
      expect(parsed.type).toBe('i')
    })
  })

  describe('Boolean Operations - Raw JSON Output', () => {
    it('should return JSON for greater than comparison', () => {
      const result = parsec.evalRaw('5 > 3')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('true')
      expect(parsed.type).toBe('b')
    })

    it('should return JSON for less than comparison', () => {
      const result = parsec.evalRaw('2 < 1')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('false')
      expect(parsed.type).toBe('b')
    })

    it('should return JSON for equality comparison', () => {
      const result = parsec.evalRaw('3 == 3')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('true')
      expect(parsed.type).toBe('b')
    })

    it('should return JSON for inequality comparison', () => {
      const result = parsec.evalRaw('3 != 4')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('true')
      expect(parsed.type).toBe('b')
    })
  })

  describe('String Functions - Raw JSON Output', () => {
    it('should return JSON for string concatenation', () => {
      const result = parsec.evalRaw('concat("Hello", " World")')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('Hello World')
      expect(parsed.type).toBe('s')
    })

    it('should return JSON for string length', () => {
      const result = parsec.evalRaw('length("test")')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('4')
      expect(parsed.type).toBe('i')
    })

    it('should return JSON for string uppercase conversion', () => {
      const result = parsec.evalRaw('toupper("hello")')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('HELLO')
      expect(parsed.type).toBe('s')
    })

    it('should return JSON for string lowercase conversion', () => {
      const result = parsec.evalRaw('tolower("WORLD")')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('world')
      expect(parsed.type).toBe('s')
    })
  })

  describe('Complex Expressions - Raw JSON Output', () => {
    it('should return JSON for order of operations', () => {
      const result = parsec.evalRaw('2 + 3 * 4')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('14')
      expect(parsed.type).toBe('i')
    })

    it('should return JSON for parentheses precedence', () => {
      const result = parsec.evalRaw('(2 + 3) * 4')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('20')
      expect(parsed.type).toBe('i')
    })

    it('should return JSON for nested function calls', () => {
      const result = parsec.evalRaw('abs(sin(0) - 1)')
      const parsed = JSON.parse(result)
      
      expect(parsed.val).toBe('1')
      expect(parsed.type).toBe('i')  // C++ returns integer for exact integer results
    })
  })

  describe('Error Handling - Raw JSON', () => {
    it('should throw error for invalid syntax (not return error JSON)', () => {
      expect(() => {
        parsec.evalRaw('2 + )')  // Actual syntax error - unmatched parenthesis
      }).toThrow()
    })

    it('should throw error for undefined variables', () => {
      expect(() => {
        parsec.evalRaw('x + 1')
      }).toThrow()
    })

    it('should throw error for empty equation', () => {
      expect(() => {
        parsec.evalRaw('')
      }).toThrow()
    })

    it('should throw error for whitespace-only equation', () => {
      expect(() => {
        parsec.evalRaw('   ')
      }).toThrow()
    })
  })

  describe('Comparison with eval() function', () => {
    it('should return JSON string while eval() returns JavaScript type for integers', () => {
      const rawResult = parsec.evalRaw('2 + 3')
      const evalResult = parsec.eval('2 + 3')
      
      expect(typeof rawResult).toBe('string')
      expect(typeof evalResult).toBe('number')
      
      const parsed = JSON.parse(rawResult)
      expect(parsed.val).toBe('5')
      expect(parsed.type).toBe('i')
      expect(evalResult).toBe(5)
    })

    it('should return JSON string while eval() returns JavaScript type for floats', () => {
      const rawResult = parsec.evalRaw('7 / 2')
      const evalResult = parsec.eval('7 / 2')
      
      expect(typeof rawResult).toBe('string')
      expect(typeof evalResult).toBe('number')
      
      const parsed = JSON.parse(rawResult)
      expect(parsed.val).toBe('3.5')
      expect(parsed.type).toBe('f')
      expect(evalResult).toBe(3.5)
    })

    it('should return JSON string while eval() returns JavaScript type for booleans', () => {
      const rawResult = parsec.evalRaw('5 > 3')
      const evalResult = parsec.eval('5 > 3')
      
      expect(typeof rawResult).toBe('string')
      expect(typeof evalResult).toBe('boolean')
      
      const parsed = JSON.parse(rawResult)
      expect(parsed.val).toBe('true')
      expect(parsed.type).toBe('b')
      expect(evalResult).toBe(true)
    })

    it('should return JSON string while eval() returns JavaScript type for strings', () => {
      const rawResult = parsec.evalRaw('concat("Hello", " World")')
      const evalResult = parsec.eval('concat("Hello", " World")')
      
      expect(typeof rawResult).toBe('string')
      expect(typeof evalResult).toBe('string')
      
      const parsed = JSON.parse(rawResult)
      expect(parsed.val).toBe('Hello World')
      expect(parsed.type).toBe('s')
      expect(evalResult).toBe('Hello World')
    })
  })

  describe('Platform Consistency Tests', () => {
    it('should match expected C++ CalcJson format exactly', () => {
      const result = parsec.evalRaw('42')
      const parsed = JSON.parse(result)
      
      // Verify exact format matches C++ CalcJson output
      expect(parsed).toEqual({
        val: '42',
        type: 'i'
      })
      
      // Ensure no extra properties
      expect(Object.keys(parsed).sort()).toEqual(['type', 'val'])
    })

    it('should preserve C++ float formatting', () => {
      const result = parsec.evalRaw('3.14159')
      const parsed = JSON.parse(result)
      
      expect(parsed.type).toBe('f')
      expect(parsed.val).toMatch(/^3\.14159/)
    })

    it('should preserve C++ special float values exactly', () => {
      const tests = [
        { expr: '1/0', expectedVal: 'inf' },
        { expr: '-1/0', expectedVal: '-inf' },
        { expr: '0/0', expectedVal: '-nan' }  // C++ actually returns -nan for 0/0
      ]
      
      tests.forEach(({ expr, expectedVal }) => {
        const result = parsec.evalRaw(expr)
        const parsed = JSON.parse(result)
        
        expect(parsed.val).toBe(expectedVal)
        expect(parsed.type).toBe('f')
      })
    })
  })
})