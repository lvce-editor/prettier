import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-yaml'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.yml`, ` - x: 1`)
  await Main.openUri(`${tmpDir}/test.yml`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('- x: 1')
}
