import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-package-json-config'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpRoot = await FileSystem.getTmpDir()
  const tmpDir = `${tmpRoot}/package-config`
  await FileSystem.mkdir(tmpDir)
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
