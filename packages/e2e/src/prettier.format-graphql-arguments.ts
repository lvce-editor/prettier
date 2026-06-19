import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-graphql-arguments'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.gql`,
    `{ human(id: "1000") {name height}  }`,
  )
  await Main.openUri(`${tmpDir}/test.gql`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(
    '{  human(id: "1000") {    name    height  }}',
  )
}
