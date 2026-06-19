import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-nested-rule'

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
    `${tmpDir}/test.css`,
    `@media (min-width:1px){h1{color:red}}`,
  )
  await Main.openUri(`${tmpDir}/test.css`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(
    '@media (min-width: 1px) {  h1 {    color: red;  }}',
  )
}
