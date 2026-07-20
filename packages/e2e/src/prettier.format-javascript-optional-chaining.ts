import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-optional-chaining'

const input = 'const city=user?.address?.city??"Unknown"'
const expected = 'const city = user?.address?.city ?? "Unknown";\n'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, input)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
