import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-benchmark-small-file-with-changes'

const input = `const value={foo:1,bar:[1,2,3]};`
const expected = `const value = { foo: 1, bar: [1, 2, 3] };\n`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, input)
  await Main.openUri(`${tmpDir}/test.js`)

  // act/assert
  for (let i = 0; i < 5; i++) {
    await Editor.setText(input)
    await Editor.format()
    await Editor.shouldHaveText(expected)
  }
}
