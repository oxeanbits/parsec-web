/**
 * Mathematical Functions Tests
 *
 * Tests for trigonometric, logarithmic, exponential, and other
 * mathematical functions that are actually supported by equations-parser.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { createTestEvaluator, assertAlmostEqual } from './setup.js'

describe('Mathematical Functions', () => {
  let parsec

  beforeAll(async () => {
    parsec = await createTestEvaluator()
  })

  describe('Trigonometric Functions', () => {
    it('should calculate sine correctly', () => {
      expect(parsec.eval('sin(0)')).toBe(0)
      assertAlmostEqual(parsec.eval('sin(pi/2)'), 1, 1e-10)
      assertAlmostEqual(parsec.eval('sin(pi)'), 0, 1e-10)
      assertAlmostEqual(parsec.eval('sin(3*pi/2)'), -1, 1e-10)
    })

    it('should calculate cosine correctly', () => {
      expect(parsec.eval('cos(0)')).toBe(1)
      assertAlmostEqual(parsec.eval('cos(pi/2)'), 0, 1e-10)
      assertAlmostEqual(parsec.eval('cos(pi)'), -1, 1e-10)
      assertAlmostEqual(parsec.eval('cos(3*pi/2)'), 0, 1e-10)
    })

    it('should calculate tangent correctly', () => {
      expect(parsec.eval('tan(0)')).toBe(0)
      assertAlmostEqual(parsec.eval('tan(pi/4)'), 1, 1e-10)
      assertAlmostEqual(parsec.eval('tan(pi)'), 0, 1e-10)
    })

    it('should calculate inverse trigonometric functions', () => {
      assertAlmostEqual(parsec.eval('asin(0)'), 0, 1e-10)
      assertAlmostEqual(parsec.eval('asin(1)'), Math.PI / 2, 1e-10)
      assertAlmostEqual(parsec.eval('acos(1)'), 0, 1e-10)
      assertAlmostEqual(parsec.eval('acos(0)'), Math.PI / 2, 1e-10)
      assertAlmostEqual(parsec.eval('atan(0)'), 0, 1e-10)
      assertAlmostEqual(parsec.eval('atan(1)'), Math.PI / 4, 1e-10)
    })

    it('should calculate atan2 with quadrant fix', () => {
      assertAlmostEqual(parsec.eval('atan2(1, 1)'), Math.PI / 4, 1e-10)
      assertAlmostEqual(parsec.eval('atan2(1, -1)'), (3 * Math.PI) / 4, 1e-10)
      assertAlmostEqual(parsec.eval('atan2(-1, -1)'), (-3 * Math.PI) / 4, 1e-10)
      assertAlmostEqual(parsec.eval('atan2(-1, 1)'), -Math.PI / 4, 1e-10)
    })
  })

  describe('Hyperbolic Functions', () => {
    it('should calculate hyperbolic sine', () => {
      expect(parsec.eval('sinh(0)')).toBe(0)
      assertAlmostEqual(parsec.eval('sinh(1)'), Math.sinh(1), 1e-10)
      assertAlmostEqual(parsec.eval('sinh(-1)'), Math.sinh(-1), 1e-10)
    })

    it('should calculate hyperbolic cosine', () => {
      expect(parsec.eval('cosh(0)')).toBe(1)
      assertAlmostEqual(parsec.eval('cosh(1)'), Math.cosh(1), 1e-10)
      assertAlmostEqual(parsec.eval('cosh(-1)'), Math.cosh(-1), 1e-10)
    })

    it('should calculate hyperbolic tangent', () => {
      expect(parsec.eval('tanh(0)')).toBe(0)
      assertAlmostEqual(parsec.eval('tanh(1)'), Math.tanh(1), 1e-10)
      assertAlmostEqual(parsec.eval('tanh(-1)'), Math.tanh(-1), 1e-10)
    })

    it('should calculate inverse hyperbolic functions', () => {
      expect(parsec.eval('asinh(0)')).toBe(0)
      assertAlmostEqual(parsec.eval('asinh(1)'), Math.asinh(1), 1e-10)
      expect(parsec.eval('acosh(1)')).toBe(0)
      assertAlmostEqual(parsec.eval('acosh(2)'), Math.acosh(2), 1e-10)
      expect(parsec.eval('atanh(0)')).toBe(0)
      assertAlmostEqual(parsec.eval('atanh(0.5)'), Math.atanh(0.5), 1e-10)
    })
  })

  describe('Logarithmic and Exponential Functions', () => {
    it('should calculate natural logarithm', () => {
      expect(parsec.eval('ln(1)')).toBe(0)
      assertAlmostEqual(parsec.eval('ln(e)'), 1, 1e-10)
      assertAlmostEqual(parsec.eval('ln(10)'), Math.log(10), 1e-10)
    })

    it('should calculate log as natural logarithm', () => {
      expect(parsec.eval('log(1)')).toBe(0)
      assertAlmostEqual(parsec.eval('log(e)'), 1, 1e-10)
      assertAlmostEqual(parsec.eval('log(10)'), Math.log(10), 1e-10)
    })

    it('should calculate base-10 logarithm', () => {
      expect(parsec.eval('log10(1)')).toBe(0)
      expect(parsec.eval('log10(10)')).toBe(1)
      expect(parsec.eval('log10(100)')).toBe(2)
    })

    it('should calculate base-2 logarithm', () => {
      expect(parsec.eval('log2(1)')).toBe(0)
      expect(parsec.eval('log2(2)')).toBe(1)
      expect(parsec.eval('log2(8)')).toBe(3)
    })

    it('should calculate exponential function', () => {
      expect(parsec.eval('exp(0)')).toBe(1)
      assertAlmostEqual(parsec.eval('exp(1)'), Math.E, 1e-10)
      assertAlmostEqual(parsec.eval('exp(2)'), Math.E * Math.E, 1e-10)
    })

    it('should handle logarithm edge cases', () => {
      expect(parsec.eval('ln(0)')).toBe(-Infinity)
      expect(parsec.eval('ln(-1)')).toBeNaN()
      expect(parsec.eval('log10(0)')).toBe(-Infinity)
      expect(parsec.eval('log10(-1)')).toBeNaN()
    })
  })

  describe('Type Casting', () => {
    it('should cast to float', () => {
      expect(parsec.eval('(float)5')).toBe(5.0)
      expect(parsec.eval('(float)3.14')).toBe(3.14)
    })

    it('should cast to int', () => {
      expect(parsec.eval('(int)5.7')).toBe(5)
      expect(parsec.eval('(int)3.14')).toBe(3)
      expect(parsec.eval('(int)-2.8')).toBe(-2)
    })

    it('should calculate factorial', () => {
      expect(parsec.eval('5!')).toBe(120)
      expect(parsec.eval('0!')).toBe(1)
      expect(parsec.eval('1!')).toBe(1)
      expect(parsec.eval('3!')).toBe(6)
    })
  })
})
