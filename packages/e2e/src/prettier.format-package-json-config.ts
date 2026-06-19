export const name = 'prettier.format-package-json-config'

export const skip=1

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/package.json`,
    JSON.stringify({
      prettier: {
        semi: false,
        singleQuote: true,
      },
    }),
  )
  await FileSystem.writeFile(`${tmpDir}/test.js`, `let message="hello";`)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(`let message = 'hello'`)
}
