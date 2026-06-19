export const name = 'prettier.format-javascript-module'

export const test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.mjs`, `export  const x=1`)
  await Main.openUri(`${tmpDir}/test.mjs`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('export const x = 1;')
}
