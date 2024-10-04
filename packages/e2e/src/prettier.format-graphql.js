export const name = 'prettier.format-css'

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.gql`,
    `{
    hero {
    name
  }
}`,
  )
  await Main.openUri(`${tmpDir}/test.gql`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(`{  hero {    name  }}`)
}
