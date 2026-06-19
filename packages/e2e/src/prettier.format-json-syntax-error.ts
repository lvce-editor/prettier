import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-json-syntax-error'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const text = '{  "name": }'
  await FileSystem.writeFile(`${tmpDir}/test.json`, text)
  await Main.openUri(`${tmpDir}/test.json`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(text)
}
