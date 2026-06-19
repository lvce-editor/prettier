import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-with-embedded-css-and-js'

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
  await FileSystem.writeFile(
    `${tmpDir}/test.html`,
    `<script>const  x=1</script><style>h1{color:red}</style>`,
  )
  await Main.openUri(`${tmpDir}/test.html`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(
    '<script>  const x = 1;</script><style>  h1 {    color: red;  }</style>',
  )
}
