import * as LaunchWorker from '../src/parts/LaunchWorker/LaunchWorker.ts'
import { jest, test, expect } from '@jest/globals'

test('launchWorker', async () => {
  const mockRpc = {}
  globalThis['vscode'] = {
    createRpc: jest.fn(() => {
      return mockRpc
    }),
  }
  expect(
    await LaunchWorker.launchWorker({
      url: '/test/worker.js',
      name: 'Test',
      contentSecurityPolicy: '',
    }),
  ).toBe(mockRpc)
})
