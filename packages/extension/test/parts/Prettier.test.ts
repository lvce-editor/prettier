import { expect, jest, test } from '@jest/globals'
import * as PrettierModuleId from '../../src/parts/PrettierModuleId/PrettierModuleId.ts'

const format = jest.fn()
const formatWithCursor = jest.fn()
const load = jest.fn(async () => ({
  format,
  formatWithCursor,
}))

jest.unstable_mockModule(
  '../../src/parts/PrettierModule/PrettierModule.ts',
  () => ({
    load,
  }),
)

const Prettier = await import('../../src/parts/Prettier/Prettier.ts')

test('loads standalone prettier and re-exports format functions', () => {
  expect(load).toHaveBeenCalledWith(PrettierModuleId.Standalone)
  expect(Prettier.format).toBe(format)
  expect(Prettier.formatWithCursor).toBe(formatWithCursor)
})
