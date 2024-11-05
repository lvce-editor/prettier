export const name = 'prettier.format-typescript'

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.ts`, `let  x=1`)
  await Main.openUri(`${tmpDir}/test.ts`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('let x = 1;')
}
