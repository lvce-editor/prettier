import { expect, jest, test } from '@jest/globals'

const activate = jest.fn()
const deactivate = jest.fn()
const mainModule = {
  activate,
  deactivate,
}

jest.unstable_mockModule('../src/parts/Main/Main.ts', () => mainModule)

const prettierMain = await import('../src/prettierMain.ts')

test('re-exports activate and deactivate', () => {
  expect(prettierMain.activate).toBe(activate)
  expect(prettierMain.deactivate).toBe(deactivate)
})
