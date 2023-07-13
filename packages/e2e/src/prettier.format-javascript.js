export const name = 'prettier.format-javascript'

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, `let  x=1`)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('let x = 1;')
}
