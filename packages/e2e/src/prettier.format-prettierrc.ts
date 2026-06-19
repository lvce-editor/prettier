<<<<<<< HEAD
export const name = 'prettier.format-prettierrc'
=======
import type { Test } from "@lvce-editor/test-with-playwright";

export const name = "prettier.format-prettierrc";
>>>>>>> origin/main

export const skip = 1

export const test: Test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/.prettierrc`,
    JSON.stringify({
      semi: false,
      singleQuote: true,
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
