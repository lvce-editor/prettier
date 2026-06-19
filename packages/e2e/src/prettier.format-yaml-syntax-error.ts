import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-yaml-syntax-error'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const text = 'foo:  [bar'
  await FileSystem.writeFile(`${tmpDir}/test.yml`, text)
  await Main.openUri(`${tmpDir}/test.yml`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(text)
}
