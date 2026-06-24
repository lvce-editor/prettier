import { expect, test } from '@jest/globals'
import * as ErrorCodes from '../../src/parts/ErrorCodes/ErrorCodes.ts'

test('exports stable error code constants', () => {
  expect(ErrorCodes.ENOENT).toBe('ENOENT')
  expect(ErrorCodes.E_COMMAND_NOT_FOUND).toBe('E_COMMAND_NOT_FOUND')
})
