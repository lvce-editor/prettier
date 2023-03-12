import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const GetResponse = await import('../src/parts/GetResponse/GetResponse.js')

test('getResponse - error', async () => {
  // @ts-ignore
  Command.execute.mockImplementation((id) => {
    throw new TypeError('x is not a function')
  })
  expect(
    await GetResponse.getResponse({
      jsonrpc: '2.0',
      method: 'test.error',
      params: [],
      id: 1,
    })
  ).toEqual({
    jsonrpc: '2.0',
    id: 1,
    error: {
      message: 'x is not a function',
      name: 'TypeError',
      type: 'TypeError',
      stack: expect.any(String),
    },
  })
})
