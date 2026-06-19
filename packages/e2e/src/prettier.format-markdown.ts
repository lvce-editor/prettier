export const name = 'prettier.format-markdown'

export const test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.md`, ` # test`)
  await Main.openUri(`${tmpDir}/test.md`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('# test')
}
