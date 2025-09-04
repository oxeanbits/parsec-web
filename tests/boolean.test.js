/**
 * Boolean and Comparison Operations Tests
 *
 * Tests for boolean logic, comparison operators, and conditional expressions
 * supported by the equations-parser WebAssembly module.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { createTestEvaluator } from './setup.js'

describe('Boolean and Comparison Operations', () => {
  let parsec

  beforeAll(async () => {
    parsec = await createTestEvaluator()
  })

  describe('Boolean Values', () => {
    it('should handle boolean literals', () => {
      expect(parsec.eval('true')).toBe(true)
      expect(parsec.eval('false')).toBe(false)
    })

    it('should handle null value', () => {
      expect(parsec.eval('null')).toBe(0) // null evaluates to 0 in equations-parser
    })
  })

  describe('Comparison Operators', () => {
    it('should perform greater than comparisons', () => {
      expect(parsec.eval('5 > 3')).toBe(true)
      expect(parsec.eval('3 > 5')).toBe(false)
      expect(parsec.eval('5 > 5')).toBe(false)
    })

    it('should perform less than comparisons', () => {
      expect(parsec.eval('3 < 5')).toBe(true)
      expect(parsec.eval('5 < 3')).toBe(false)
      expect(parsec.eval('5 < 5')).toBe(false)
    })

    it('should perform greater than or equal comparisons', () => {
      expect(parsec.eval('5 >= 3')).toBe(true)
      expect(parsec.eval('3 >= 5')).toBe(false)
      expect(parsec.eval('5 >= 5')).toBe(true)
    })

    it('should perform less than or equal comparisons', () => {
      expect(parsec.eval('3 <= 5')).toBe(true)
      expect(parsec.eval('5 <= 3')).toBe(false)
      expect(parsec.eval('5 <= 5')).toBe(true)
    })

    it('should perform equality comparisons', () => {
      expect(parsec.eval('5 == 5')).toBe(true)
      expect(parsec.eval('5 == 3')).toBe(false)
      expect(parsec.eval('"hello" == "hello"')).toBe(true)
      expect(parsec.eval('"hello" == "world"')).toBe(false)
    })

    it('should perform inequality comparisons', () => {
      expect(parsec.eval('5 != 3')).toBe(true)
      expect(parsec.eval('5 != 5')).toBe(false)
      expect(parsec.eval('"hello" != "world"')).toBe(true)
      expect(parsec.eval('"hello" != "hello"')).toBe(false)
    })
  })

  describe('Logical Operators', () => {
    it('should perform logical AND with &&', () => {
      expect(parsec.eval('true && true')).toBe(true)
      expect(parsec.eval('true && false')).toBe(false)
      expect(parsec.eval('false && true')).toBe(false)
      expect(parsec.eval('false && false')).toBe(false)
    })

    it('should perform logical OR with ||', () => {
      expect(parsec.eval('true || true')).toBe(true)
      expect(parsec.eval('true || false')).toBe(true)
      expect(parsec.eval('false || true')).toBe(true)
      expect(parsec.eval('false || false')).toBe(false)
    })

    it('should perform logical AND with "and"', () => {
      expect(parsec.eval('true and true')).toBe(true)
      expect(parsec.eval('true and false')).toBe(false)
      expect(parsec.eval('false and true')).toBe(false)
      expect(parsec.eval('false and false')).toBe(false)
    })

    it('should perform logical OR with "or"', () => {
      expect(parsec.eval('true or true')).toBe(true)
      expect(parsec.eval('true or false')).toBe(true)
      expect(parsec.eval('false or true')).toBe(true)
      expect(parsec.eval('false or false')).toBe(false)
    })
  })

  describe('Bitwise Operators', () => {
    it('should perform bitwise AND', () => {
      expect(parsec.eval('5 & 3')).toBe(1) // 101 & 011 = 001
      expect(parsec.eval('7 & 3')).toBe(3) // 111 & 011 = 011
    })

    it('should perform bitwise OR', () => {
      expect(parsec.eval('5 | 3')).toBe(7) // 101 | 011 = 111
      expect(parsec.eval('4 | 2')).toBe(6) // 100 | 010 = 110
    })

    it('should perform bit shift operations', () => {
      expect(parsec.eval('4 << 1')).toBe(8) // 100 << 1 = 1000
      expect(parsec.eval('8 >> 1')).toBe(4) // 1000 >> 1 = 100
      expect(parsec.eval('16 >> 2')).toBe(4) // 10000 >> 2 = 100
    })
  })

  describe('Conditional (Ternary) Operator', () => {
    it('should evaluate ternary conditions correctly', () => {
      expect(parsec.eval('true ? 42 : 0')).toBe(42)
      expect(parsec.eval('false ? 42 : 0')).toBe(0)
      expect(parsec.eval('5 > 3 ? "yes" : "no"')).toBe('yes')
      expect(parsec.eval('2 > 3 ? "yes" : "no"')).toBe('no')
    })

    it('should handle nested ternary operators', () => {
      expect(parsec.eval('true ? (false ? 1 : 2) : 3')).toBe(2)
      expect(parsec.eval('false ? 1 : (true ? 2 : 3)')).toBe(2)
    })

    it('should handle complex conditions', () => {
      expect(parsec.eval('(5 > 3 && 2 < 4) ? "both true" : "not both"')).toBe('both true')
      expect(parsec.eval('(5 > 3 && 2 > 4) ? "both true" : "not both"')).toBe('not both')
    })
  })

  describe('Complex Boolean Expressions', () => {
    it('should handle complex logical combinations', () => {
      expect(parsec.eval('(5 > 3) && (2 < 4)')).toBe(true)
      expect(parsec.eval('(5 > 3) && (2 > 4)')).toBe(false)
      expect(parsec.eval('(5 > 3) || (2 > 4)')).toBe(true)
      expect(parsec.eval('(5 < 3) || (2 > 4)')).toBe(false)
    })

    it('should handle parentheses for precedence', () => {
      expect(parsec.eval('true && false || true')).toBe(true)
      expect(parsec.eval('true && (false || true)')).toBe(true)
      expect(parsec.eval('(true && false) || true')).toBe(true)
    })
  })

  describe('String Comparisons', () => {
    it('should compare strings correctly', () => {
      expect(parsec.eval('"apple" < "banana"')).toBe(true)
      expect(parsec.eval('"zebra" > "apple"')).toBe(true)
      expect(parsec.eval('"hello" == "hello"')).toBe(true)
      expect(parsec.eval('"Hello" == "hello"')).toBe(false)
    })
  })

  describe('Mixed Type Comparisons', () => {
    it('should handle number to string comparisons', () => {
      expect(parsec.eval('5 == string(5)')).toBe(false) // Type matters
      expect(parsec.eval('5 == number("5")')).toBe(true)
    })
  })
})
