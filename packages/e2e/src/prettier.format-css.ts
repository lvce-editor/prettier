export const name = 'prettier.format-css'

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.css`,
    `h1 {
  font-size:10px
}`
  )
  await Main.openUri(`${tmpDir}/test.css`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(`h1 {  font-size: 10px;}`)
}
