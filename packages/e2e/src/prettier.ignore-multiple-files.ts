import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.ignore-multiple-files'

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
  await FileSystem.mkdir(`${tmpDir}/src`)
  await FileSystem.writeFile(`${tmpDir}/.prettierignore`, `src/*.js`)
  await FileSystem.writeFile(`${tmpDir}/src/.prettierignore`, `!keep.js`)
  await FileSystem.writeFile(`${tmpDir}/src/keep.js`, `let  x=1`)
  await Main.openUri(`${tmpDir}/src/keep.js`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('let x = 1;')
}
