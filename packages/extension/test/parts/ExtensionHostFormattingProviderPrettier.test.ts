import { expect, jest, test } from '@jest/globals'

const format = jest.fn()

jest.unstable_mockModule('../../src/parts/Format/Format.ts', () => ({
  format,
}))

const Provider =
  await import('../../src/parts/ExtensionHost/ExtensionHostFormattingProviderPrettier.ts')

test('exports provider metadata', () => {
  expect(Provider.id).toBe('prettier')
  expect(Provider.label).toBe('Prettier')
  expect(Provider.languageId).toBe('css')
})

test('format converts offset based edit to provider result', async () => {
  format.mockResolvedValue({
    endOffset: 7,
    inserted: 'const value = 1\n',
    startOffset: 0,
  } as never)

  await expect(
    Provider.format({
      uri: '/test/file.js',
      text: 'const value=1',
    }),
  ).resolves.toEqual([
    {
      endOffset: 7,
      inserted: 'const value = 1\n',
      startOffset: 0,
    },
  ])
  expect(format).toHaveBeenCalledWith('/test/file.js', 'const value=1')
})

test('format returns empty edits when formatter returns no edit', async () => {
  format.mockResolvedValue(undefined as never)

  await expect(
    Provider.format({
      uri: '/test/file.js',
      text: 'const value = 1\n',
    }),
  ).resolves.toEqual([])
})
