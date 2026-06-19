import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-graphql-syntax-error'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const text = 'query  { user('
  await FileSystem.writeFile(`${tmpDir}/test.gql`, text)
  await Main.openUri(`${tmpDir}/test.gql`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(text)
}
