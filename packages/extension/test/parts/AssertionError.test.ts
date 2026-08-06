import { expect, test } from '@jest/globals'
import { AssertionError } from '../../src/parts/AssertionError/AssertionError.ts'

test('sets error name and message', () => {
  const error = new AssertionError('expected value')

  expect(error).toBeInstanceOf(Error)
  expect(error.name).toBe('AssertionError')
  expect(error.message).toBe('expected value')
})
