export const name = 'prettier.format-benchmark-small-file-no-changes'

const text = `const value = { foo: 1, bar: [1, 2, 3] };\n`

export const test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, text)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  for (let i = 0; i < 5; i++) {
    await Editor.format()
  }

  // assert
  await Editor.shouldHaveText(text)
}
