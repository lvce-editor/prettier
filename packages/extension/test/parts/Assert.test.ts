import { expect, test } from '@jest/globals'
import * as Assert from '../../src/parts/Assert/Assert.ts'
import { AssertionError } from '../../src/parts/AssertionError/AssertionError.ts'

test('object accepts plain objects', () => {
  expect(() => Assert.object({})).not.toThrow()
})

test('object rejects arrays and null', () => {
  expect(() => Assert.object([])).toThrow(AssertionError)
  expect(() => Assert.object(null)).toThrow(AssertionError)
})

test('number accepts numbers except NaN', () => {
  expect(() => Assert.number(1)).not.toThrow()
  expect(() => Assert.number(Number.NaN)).toThrow('value is NaN')
})

test('array accepts arrays', () => {
  expect(() => Assert.array([])).not.toThrow()
  expect(() => Assert.array({ length: 0 })).toThrow(AssertionError)
})

test('string accepts strings', () => {
  expect(() => Assert.string('value')).not.toThrow()
  expect(() => Assert.string(1)).toThrow(AssertionError)
})

test('null_ accepts null', () => {
  expect(() => Assert.null_(null)).not.toThrow()
  expect(() => Assert.null_(undefined)).toThrow(AssertionError)
})

test('boolean accepts booleans', () => {
  expect(() => Assert.boolean(false)).not.toThrow()
  expect(() => Assert.boolean('false')).toThrow(AssertionError)
})

test('fn accepts functions', () => {
  expect(() => Assert.fn(() => {})).not.toThrow()
  expect(() => Assert.fn({})).toThrow(AssertionError)
})

test('uint32array accepts uint32 arrays', () => {
  expect(() => Assert.uint32array(new Uint32Array())).not.toThrow()
  expect(() => Assert.uint32array(new Uint8Array())).toThrow(AssertionError)
})
