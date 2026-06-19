export const name = 'prettier.format-typescript-syntax-error'

export const test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const text = 'type  User = { name: string'
  await FileSystem.writeFile(`${tmpDir}/test.ts`, text)
  await Main.openUri(`${tmpDir}/test.ts`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(text)
}
