import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-syntax-error'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const text = `h1 {
  font-size 10px
}`
  await FileSystem.writeFile(`${tmpDir}/test.css`, text)
  await Main.openUri(`${tmpDir}/test.css`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('h1 {  font-size 10px}')
}
