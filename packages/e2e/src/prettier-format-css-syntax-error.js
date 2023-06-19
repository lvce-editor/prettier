export const name = 'prettier.format-css'

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.css`,
    `h1 {
  font-size 10px
}`
  )
  await Main.openUri(`${tmpDir}/test.css`)

  // act
  await Editor.format()

  // assert
  const message = Locator('.EditorOverlayMessage')
  await expect(message)
    .toHaveText(`Error: Failed to execute formatting provider: Failed to format memfs:///workspace/test.css: SyntaxError: CssSyntaxError: Unknown word (2:3)
  1 | h1 {
> 2 |   font-size 10px
    |   ^
  3 | }`)
}
