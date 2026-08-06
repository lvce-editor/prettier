import { afterEach, expect, jest, test } from '@jest/globals'
import * as OutputChannel from '../../src/parts/OutputChannel/OutputChannel.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('log forwards message to console.info', () => {
  const info = jest.spyOn(console, 'info').mockImplementation(() => {})

  OutputChannel.log('formatting file')

  expect(info).toHaveBeenCalledWith('formatting file')
})
