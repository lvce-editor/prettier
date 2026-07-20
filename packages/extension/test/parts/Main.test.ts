import { expect, jest, test } from '@jest/globals'

const activateExtensionApi = jest.fn()
const registerFormattingProvider = jest.fn()

jest.unstable_mockModule('@lvce-editor/api', () => ({
  activate: activateExtensionApi,
  registerFormattingProvider,
}))

jest.unstable_mockModule('../../src/parts/LanguageIds/LanguageIds.ts', () => ({
  languageIds: ['css', 'javascript'],
}))

jest.unstable_mockModule(
  '../../src/parts/ExtensionHost/ExtensionHostFormattingProviderPrettier.ts',
  () => ({
    format: jest.fn(),
    id: 'prettier',
    label: 'Prettier',
    languageId: 'css',
  }),
)

const Main = await import('../../src/parts/Main/Main.ts')

test('activate registers prettier formatting providers once', async () => {
  await Main.activate()
  await Main.activate()

  expect(activateExtensionApi).toHaveBeenCalledTimes(1)
  expect(registerFormattingProvider).toHaveBeenCalledTimes(2)
  expect(registerFormattingProvider).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      id: 'prettier.css',
      languageId: 'css',
    }),
  )
  expect(registerFormattingProvider).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      id: 'prettier.javascript',
      languageId: 'javascript',
    }),
  )
})

test('deactivate is a no-op', () => {
  expect(Main.deactivate()).toBeUndefined()
})
