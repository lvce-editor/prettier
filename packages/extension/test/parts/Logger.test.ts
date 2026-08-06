import { afterEach, expect, jest, test } from '@jest/globals'
import * as Logger from '../../src/parts/Logger/Logger.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('info forwards all arguments to console.info', () => {
  const info = jest.spyOn(console, 'info').mockImplementation(() => {})

  Logger.info('message', { value: 1 })

  expect(info).toHaveBeenCalledWith('message', { value: 1 })
})

test('warn forwards all arguments to console.warn', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})

  Logger.warn('message', { value: 1 })

  expect(warn).toHaveBeenCalledWith('message', { value: 1 })
})
