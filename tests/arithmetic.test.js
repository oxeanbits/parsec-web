/**
 * Arithmetic Operations Tests
 * 
 * Tests basic arithmetic operations that are actually supported 
 * by the equations-parser WebAssembly module.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { testUtils, createTestEvaluator, assertAlmostEqual } from './setup.js'

describe('Arithmetic Operations', () => {
  let parsec

  beforeAll(async () => {
    parsec = await createTestEvaluator()
  })

  describe('Basic Operations', () => {
    it('should perform addition correctly', () => {
      expect(parsec.eval('2 + 3')).toBe(5)
      expect(parsec.eval('0 + 0')).toBe(0)
      expect(parsec.eval('-5 + 3')).toBe(-2)
      expect(parsec.eval('1.5 + 2.5')).toBe(4)
    })

    it('should perform subtraction correctly', () => {
      expect(parsec.eval('5 - 3')).toBe(2)
      expect(parsec.eval('0 - 0')).toBe(0)
      expect(parsec.eval('-5 - 3')).toBe(-8)
      assertAlmostEqual(parsec.eval('10.5 - 2.3'), 8.2, 1e-10)
    })

    it('should perform multiplication correctly', () => {
      expect(parsec.eval('3 * 4')).toBe(12)
      expect(parsec.eval('0 * 5')).toBe(0)
      expect(parsec.eval('-3 * 4')).toBe(-12)
      expect(parsec.eval('1.5 * 2')).toBe(3)
    })

    it('should perform division correctly', () => {
      expect(parsec.eval('8 / 2')).toBe(4)
      expect(parsec.eval('0 / 5')).toBe(0)
      expect(parsec.eval('-8 / 2')).toBe(-4)
      expect(parsec.eval('7 / 2')).toBe(3.5)
    })

    it('should handle division by zero', () => {
      expect(parsec.eval('5 / 0')).toBe(Infinity)
      expect(parsec.eval('0 / 0')).toBeNaN()
    })
  })

  describe('Order of Operations', () => {
    it('should follow correct precedence', () => {
      expect(parsec.eval('2 + 3 * 4')).toBe(14)
      expect(parsec.eval('(2 + 3) * 4')).toBe(20)
      expect(parsec.eval('2 * 3 + 4')).toBe(10)
      expect(parsec.eval('2 * (3 + 4)')).toBe(14)
    })

    it('should handle nested parentheses', () => {
      expect(parsec.eval('((2 + 3) * 4) - 1')).toBe(19)
      expect(parsec.eval('2 * ((3 + 4) * 2)')).toBe(28)
    })
  })

  describe('Power Operations', () => {
    it('should handle power operator', () => {
      expect(parsec.eval('2 ^ 3')).toBe(8)
      expect(parsec.eval('5 ^ 0')).toBe(1)
      expect(parsec.eval('4 ^ 0.5')).toBe(2)
    })

    it('should handle pow function', () => {
      expect(parsec.eval('pow(2, 3)')).toBe(8)
      expect(parsec.eval('pow(5, 0)')).toBe(1)
      expect(parsec.eval('pow(4, 0.5)')).toBe(2)
    })
  })

  describe('Mathematical Functions', () => {
    it('should calculate absolute values', () => {
      expect(parsec.eval('abs(-5)')).toBe(5)
      expect(parsec.eval('abs(5)')).toBe(5)
      expect(parsec.eval('abs(0)')).toBe(0)
    })

    it('should calculate square roots', () => {
      expect(parsec.eval('sqrt(0)')).toBe(0)
      expect(parsec.eval('sqrt(1)')).toBe(1)
      expect(parsec.eval('sqrt(4)')).toBe(2)
      expect(parsec.eval('sqrt(9)')).toBe(3)
      assertAlmostEqual(parsec.eval('sqrt(2)'), Math.sqrt(2), 1e-10)
    })

    it('should calculate cube roots', () => {
      expect(parsec.eval('cbrt(0)')).toBe(0)
      expect(parsec.eval('cbrt(1)')).toBe(1)
      expect(parsec.eval('cbrt(8)')).toBe(2)
      expect(parsec.eval('cbrt(27)')).toBe(3)
    })

    it('should handle root edge cases', () => {
      expect(parsec.eval('sqrt(-1)')).toBeNaN()
    })
  })

  describe('Rounding Functions', () => {
    it('should round numbers correctly', () => {
      expect(parsec.eval('round(3.2)')).toBe(3)
      expect(parsec.eval('round(3.7)')).toBe(4)
      expect(parsec.eval('round(-3.2)')).toBe(-3)
      expect(parsec.eval('round(-3.7)')).toBe(-4)
    })

    it('should round to decimal places', () => {
      assertAlmostEqual(parsec.eval('round_decimal(3.14159, 2)'), 3.14, 1e-10)
      assertAlmostEqual(parsec.eval('round_decimal(2.71828, 3)'), 2.718, 1e-10)
    })
  })

  describe('Floating Point Operations', () => {
    it('should handle decimal arithmetic', () => {
      assertAlmostEqual(parsec.eval('0.1 + 0.2'), 0.3, 1e-10)
      assertAlmostEqual(parsec.eval('1.7 * 2.3'), 3.91, 1e-10)
    })

    it('should handle scientific notation', () => {
      expect(parsec.eval('1e2')).toBe(100)
      expect(parsec.eval('2.5e-1')).toBe(0.25)
    })

    it('should handle floating point remainder', () => {
      assertAlmostEqual(parsec.eval('fmod(10.3, 3.1)'), 1.0, 1e-10)
      assertAlmostEqual(parsec.eval('remainder(10.3, 3.1)'), 1.0, 1e-10)
    })
  })

  describe('Negative Numbers', () => {
    it('should handle unary minus', () => {
      expect(parsec.eval('-5')).toBe(-5)
      expect(parsec.eval('-(3 + 2)')).toBe(-5)
      expect(parsec.eval('-(-5)')).toBe(5)
    })

    it('should handle unary plus', () => {
      expect(parsec.eval('+5')).toBe(5)
      expect(parsec.eval('+(3 + 2)')).toBe(5)
    })
  })

  describe('Min/Max Functions', () => {
    it('should find minimum values', () => {
      expect(parsec.eval('min(3, 5)')).toBe(3)
      expect(parsec.eval('min(5, 3)')).toBe(3)
      expect(parsec.eval('min(-2, -5)')).toBe(-5)
    })

    it('should find maximum values', () => {
      expect(parsec.eval('max(3, 5)')).toBe(5)
      expect(parsec.eval('max(5, 3)')).toBe(5)
      expect(parsec.eval('max(-2, -5)')).toBe(-2)
    })
  })

  describe('Aggregation Functions', () => {
    it('should calculate sum', () => {
      expect(parsec.eval('sum(1, 2, 3)')).toBe(6)
      expect(parsec.eval('sum(0)')).toBe(0)
      expect(parsec.eval('sum(-1, 1)')).toBe(0)
    })

    it('should calculate average', () => {
      expect(parsec.eval('avg(2, 4, 6)')).toBe(4)
      expect(parsec.eval('avg(1, 1, 1)')).toBe(1)
    })
  })

  describe('Mathematical Constants', () => {
    it('should provide correct mathematical constants', () => {
      assertAlmostEqual(parsec.eval('pi'), Math.PI, 1e-10)
      assertAlmostEqual(parsec.eval('e'), Math.E, 1e-10)
    })

    it('should use constants in calculations', () => {
      assertAlmostEqual(parsec.eval('2 * pi'), 2 * Math.PI, 1e-10)
      assertAlmostEqual(parsec.eval('e ^ 2'), Math.E * Math.E, 1e-10)
    })
  })

  describe('Vector Operations', () => {
    it('should calculate hypotenuse', () => {
      expect(parsec.eval('hypot(3, 4)')).toBe(5)
      expect(parsec.eval('hypot(0, 0)')).toBe(0)
      assertAlmostEqual(parsec.eval('hypot(1, 1)'), Math.sqrt(2), 1e-10)
    })
  })
})