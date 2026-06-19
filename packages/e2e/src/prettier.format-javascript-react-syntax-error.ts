export const name = 'prettier.format-javascript-react-syntax-error'

export const test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const text = 'const  element = <div>{</div>'
  await FileSystem.writeFile(`${tmpDir}/test.jsx`, text)
  await Main.openUri(`${tmpDir}/test.jsx`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(text)
}
