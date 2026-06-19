import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.ignore-extension-glob'

export const skip = 1

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/.prettierignore`, `*.generated.js`)
  await FileSystem.writeFile(`${tmpDir}/component.generated.js`, `let  x=1`)
  await Main.openUri(`${tmpDir}/component.generated.js`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('let  x=1')
}
