export const name = 'prettier.format-json'

export const test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.json`, `{ }`)
  await Main.openUri(`${tmpDir}/test.json`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('{}')
}
