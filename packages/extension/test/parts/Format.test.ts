import { afterEach, expect, jest, test } from '@jest/globals'
import { FormattingError } from '../../src/parts/FormattingError/FormattingError.ts'

const log = jest.fn()
const loadPlugin = jest.fn()
const loadPrettierModule = jest.fn()
const prettierFormat = jest.fn()

jest.unstable_mockModule(
  '../../src/parts/OutputChannel/OutputChannel.ts',
  () => ({
    log,
  }),
)

jest.unstable_mockModule(
  '../../src/parts/PluginModule/PluginModule.ts',
  () => ({
    loadPlugin,
  }),
)

jest.unstable_mockModule(
  '../../src/parts/PrettierModule/PrettierModule.ts',
  () => ({
    load: loadPrettierModule,
  }),
)

jest.unstable_mockModule('../../src/parts/Prettier/Prettier.ts', () => ({
  format: prettierFormat,
}))

const Format = await import('../../src/parts/Format/Format.ts')

afterEach(() => {
  log.mockReset()
  loadPlugin.mockReset()
  loadPrettierModule.mockReset()
  prettierFormat.mockReset()
  Format.state.plugins = Object.create(null)
})

test('format loads plugin, formats content, and returns minimized edit', async () => {
  loadPlugin.mockResolvedValue({
    parser: 'babel',
    plugins: [1, 2],
  } as never)
  loadPrettierModule
    .mockResolvedValueOnce('plugin-1' as never)
    .mockResolvedValueOnce('plugin-2' as never)
  prettierFormat.mockResolvedValue('const value = 1\n' as never)

  await expect(
    Format.format('/test/file.js', 'const value=1'),
  ).resolves.toEqual({
    endOffset: 13,
    inserted: ' = 1\n',
    startOffset: 11,
  })

  expect(log).toHaveBeenCalledWith('formatting /test/file.js')
  expect(loadPlugin).toHaveBeenCalledWith('/test/file.js')
  expect(loadPrettierModule).toHaveBeenNthCalledWith(1, 1, 0, [1, 2])
  expect(loadPrettierModule).toHaveBeenNthCalledWith(2, 2, 1, [1, 2])
  expect(prettierFormat).toHaveBeenCalledWith('const value=1', {
    parser: 'babel',
    plugins: ['plugin-1', 'plugin-2'],
  })
})

test('format reuses cached formatter for the same uri', async () => {
  loadPlugin.mockResolvedValue({
    parser: 'babel',
    plugins: [],
  } as never)
  prettierFormat
    .mockResolvedValueOnce('const a = 1\n' as never)
    .mockResolvedValueOnce('const b = 2\n' as never)

  await Format.format('/test/file.js', 'const a=1')
  await Format.format('/test/file.js', 'const b=2')

  expect(loadPlugin).toHaveBeenCalledTimes(1)
  expect(prettierFormat).toHaveBeenCalledTimes(2)
})

test('format wraps formatter failures', async () => {
  loadPlugin.mockResolvedValue({
    parser: 'babel',
    plugins: [],
  } as never)
  prettierFormat.mockRejectedValue(new Error('Unexpected token') as never)

  await expect(Format.format('/test/file.js', 'const =')).rejects.toMatchObject(
    {
      code: 'E_FORMATTING_FAILED',
      message: 'Failed to format /test/file.js: Error: Unexpected token',
      name: 'FormattingError',
    },
  )
})

test('format can use an existing formatter from state', async () => {
  Format.state.plugins['/cached.js'] = jest.fn(async () => 'let value = 1\n')

  await expect(Format.format('/cached.js', 'let value=1')).resolves.toEqual({
    endOffset: 11,
    inserted: ' = 1\n',
    startOffset: 9,
  })

  expect(loadPlugin).not.toHaveBeenCalled()
})

test('formatting error class is used for failures', async () => {
  loadPlugin.mockResolvedValue({
    parser: 'babel',
    plugins: [],
  } as never)
  prettierFormat.mockRejectedValue(new Error('No parser') as never)

  await expect(Format.format('/test/file.js', 'bad')).rejects.toBeInstanceOf(
    FormattingError,
  )
})
