import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.ignore-root-file-glob'

// export const skip = 1

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
  Workspace,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/.prettierignore`, `ignored.js`)
  await FileSystem.writeFile(`${tmpDir}/ignored.js`, `let  x=1`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/ignored.js`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('let  x=1')
}
