import { expect, test } from '@jest/globals'
import { FormattingError } from '../../src/parts/FormattingError/FormattingError.ts'

test('sets error name and formatting error code', () => {
  const error = new FormattingError('failed')

  expect(error).toBeInstanceOf(Error)
  expect(error.name).toBe('FormattingError')
  expect(error.message).toBe('failed')
  expect(error.code).toBe('E_FORMATTING_FAILED')
})
