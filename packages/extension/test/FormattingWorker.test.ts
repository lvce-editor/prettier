import { expect, jest, test } from '@jest/globals'
import { createFormattingWorker } from '../src/parts/FormattingWorker/FormattingWorker.ts'

const invoke = jest.fn<(...args: any[]) => Promise<string>>()
const createRpc = jest.fn<(...args: any[]) => Promise<any>>()
const format = createFormattingWorker(createRpc)

test('retries failed startup and shares the worker between concurrent requests', async () => {
  createRpc.mockRejectedValueOnce(new Error('startup failed'))
  await expect(format('/test.js', 'let x=1', {})).rejects.toThrow(
    'startup failed',
  )
  createRpc.mockResolvedValue({ invoke })
  invoke
    .mockResolvedValueOnce('let x = 1;\n')
    .mockResolvedValueOnce('let y = 2\n')
  await expect(
    Promise.all([
      format('/test.js', 'let x=1', {}),
      format('/other.js', 'let y=2', { semi: false }),
    ]),
  ).resolves.toEqual(['let x = 1;\n', 'let y = 2\n'])
  expect(createRpc).toHaveBeenCalledTimes(2)
  expect(createRpc).toHaveBeenLastCalledWith({
    name: 'Prettier Formatting',
    url: expect.stringContaining('/formattingWorkerMain.js'),
  })
  expect(invoke).toHaveBeenNthCalledWith(
    1,
    'Prettier.format',
    '/test.js',
    'let x=1',
    {},
  )
  expect(invoke).toHaveBeenNthCalledWith(
    2,
    'Prettier.format',
    '/other.js',
    'let y=2',
    { semi: false },
  )
  invoke.mockRejectedValueOnce(new Error('syntax error'))
  await expect(format('/test.js', '{', {})).rejects.toThrow('syntax error')
  invoke.mockResolvedValueOnce('let z = 3;\n')
  await expect(format('/test.js', 'let z=3', {})).resolves.toBe('let z = 3;\n')
  expect(createRpc).toHaveBeenCalledTimes(2)
})
